import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { EcosystemSnapshot } from './schemas/ecosystem-snapshot.schema';
import { ALL_PROJECTS, ProjectDefinition } from './projects';

const GRAPHQL_URL = 'https://graphql.mainnet.iota.cafe';

export interface Project {
  slug: string;
  name: string;
  layer: 'L1' | 'L2';
  category: string;
  description: string;
  urls: { label: string; href: string }[];
  packages: number;
  /** First package address on mainnet (L1 only) */
  packageAddress: string | null;
  /** Latest (upgraded) package address — used for event queries */
  latestPackageAddress: string | null;
  storageIota: number;
  events: number;
  eventsCapped: boolean;
  modules: string[];
  tvl: number | null;
}

interface PackageInfo {
  address: string;
  storageRebate: string;
  modules: { nodes: { name: string }[] };
}

@Injectable()
export class EcosystemService implements OnModuleInit {
  private readonly logger = new Logger(EcosystemService.name);

  constructor(
    @InjectModel(EcosystemSnapshot.name) private ecoModel: Model<EcosystemSnapshot>,
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'test') return;
    const count = await this.ecoModel.countDocuments();
    if (count === 0) {
      this.logger.log('No ecosystem snapshot found, capturing in background...');
      this.capture().catch((e) => this.logger.error('Initial ecosystem capture failed', e));
    }
  }

  async getLatest() {
    return this.ecoModel.findOne().sort({ createdAt: -1 }).lean().exec();
  }

  // Refresh every 6 hours
  @Cron('0 */6 * * *')
  async capture() {
    this.logger.log('Capturing ecosystem snapshot...');
    try {
      const data = await this.fetchFull();
      await this.ecoModel.create(data);
      this.logger.log(`Ecosystem snapshot saved: ${data.totalProjects} projects, ${data.totalEvents} events`);
    } catch (e) {
      this.logger.error('Ecosystem capture failed', e);
    }
  }

  private async graphql(query: string): Promise<any> {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const json: any = await res.json();
    if (json.errors?.length) throw new Error(json.errors[0].message);
    return json.data;
  }

  private async getAllPackages(): Promise<PackageInfo[]> {
    const packages: PackageInfo[] = [];
    let cursor: string | null = null;

    for (let page = 0; page < 20; page++) {
      const afterClause: string = cursor ? `, after: "${cursor}"` : '';
      const data: any = await this.graphql(`{
        packages(first: 50${afterClause}) {
          nodes { address storageRebate modules { nodes { name } } }
          pageInfo { hasNextPage endCursor }
        }
      }`);
      packages.push(...data.packages.nodes);
      if (!data.packages.pageInfo.hasNextPage) break;
      cursor = data.packages.pageInfo.endCursor;
    }
    return packages;
  }

  private async countEvents(emittingModule: string, maxPages = 1000): Promise<{ count: number; capped: boolean }> {
    let total = 0;
    let cursor: string | null = null;

    for (let i = 0; i < maxPages; i++) {
      const afterClause: string = cursor ? `, after: "${cursor}"` : '';
      try {
        const data: any = await this.graphql(`{
          events(filter: { emittingModule: "${emittingModule}" }, first: 50${afterClause}) {
            nodes { __typename }
            pageInfo { hasNextPage endCursor }
          }
        }`);
        total += data.events.nodes.length;
        if (!data.events.pageInfo.hasNextPage) return { count: total, capped: false };
        cursor = data.events.pageInfo.endCursor;
      } catch {
        break;
      }
    }
    return { count: total, capped: total >= maxPages * 50 };
  }

  private matchProject(mods: Set<string>): ProjectDefinition | null {
    for (const def of ALL_PROJECTS) {
      const { match } = def;
      if (match.exact) {
        const expected = new Set(match.exact);
        if (mods.size === expected.size && [...expected].every((m) => mods.has(m))) return def;
        continue;
      }
      if (match.all && !match.all.every((m) => mods.has(m))) continue;
      if (match.any && !match.any.some((m) => mods.has(m))) continue;
      if (match.minModules && mods.size < match.minModules) continue;
      return def;
    }
    return null;
  }

  private async fetchFull() {
    const allPackages = await this.getAllPackages();

    const projectMap = new Map<string, { def: ProjectDefinition; packages: PackageInfo[] }>();
    for (const pkg of allPackages) {
      if (pkg.address.startsWith('0x000000000000000000000000000000000000000000000000000000000000000')) continue;
      const mods = new Set((pkg.modules?.nodes || []).map((m) => m.name));
      const def = this.matchProject(mods);
      if (!def) continue;
      const existing = projectMap.get(def.name);
      if (existing) { existing.packages.push(pkg); } else { projectMap.set(def.name, { def, packages: [pkg] }); }
    }

    const projects: Project[] = [];
    for (const [, { def, packages }] of projectMap) {
      const latestPkg = packages[packages.length - 1];
      const mods = (latestPkg.modules?.nodes || []).map((m) => m.name);
      const totalStorage = packages.reduce((sum, p) => sum + Number(p.storageRebate || 0), 0) / 1_000_000_000;

      let events = 0;
      let eventsCapped = false;
      for (const mod of mods.slice(0, 5)) {
        const result = await this.countEvents(`${latestPkg.address}::${mod}`);
        events += result.count;
        if (result.capped) eventsCapped = true;
      }

      const firstPkg = packages[0]; // original deployment — address never changes
      const addrPrefix = firstPkg.address.slice(2, 8);
      projects.push({
        slug: `${addrPrefix}-${def.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
        name: def.name, layer: def.layer, category: def.category,
        description: def.description, urls: def.urls,
        packages: packages.length,
        packageAddress: firstPkg.address,
        latestPackageAddress: latestPkg.address,
        storageIota: Math.round(totalStorage * 10000) / 10000,
        events, eventsCapped, modules: mods,
        tvl: null,
      });
    }

    // Enrich with DefiLlama TVL + add L2 EVM projects
    try {
      const llamaRes = await fetch('https://api.llama.fi/protocols');
      const llamaData: any[] = await llamaRes.json();

      const iotaProtocols = llamaData.filter((p) =>
        (p.chains || []).some((c: string) => c === 'IOTA' || c === 'IOTA EVM'),
      );

      // Match TVL to existing L1 projects
      for (const project of projects) {
        const match = iotaProtocols.find((p) =>
          p.name.toLowerCase().includes(project.name.toLowerCase()) ||
          project.name.toLowerCase().includes(p.name.toLowerCase()),
        );
        if (match) project.tvl = match.tvl ?? null;
      }

      // Add L2 EVM projects that aren't already in the L1 list
      const existingNames = new Set(projects.map((p) => p.name.toLowerCase()));
      for (const proto of iotaProtocols) {
        const isEvm = (proto.chains || []).includes('IOTA EVM');
        const isL1Only = (proto.chains || []).includes('IOTA') && !isEvm;
        if (isL1Only && existingNames.has(proto.name.toLowerCase())) continue;

        // Skip if already matched to an L1 project
        if (existingNames.has(proto.name.toLowerCase())) continue;
        // Skip multi-chain projects where IOTA is minor (TVL < $1000)
        if ((proto.tvl ?? 0) < 100) continue;

        const llamaSlug = (proto.slug || proto.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        projects.push({
          slug: `evm-${llamaSlug}`,
          name: proto.name,
          layer: isEvm ? 'L2' : 'L1',
          category: proto.category || 'Unknown',
          description: `${proto.category || ''} on IOTA${isEvm ? ' EVM' : ''}`.trim(),
          urls: proto.url ? [{ label: 'Website', href: proto.url }] : [],
          packages: 0,
          packageAddress: null,
          latestPackageAddress: null,
          storageIota: 0,
          events: 0,
          eventsCapped: false,
          modules: [],
          tvl: proto.tvl ?? null,
        });
      }
    } catch (e) {
      this.logger.warn('DefiLlama fetch failed, L2 data unavailable', e);
    }

    projects.sort((a, b) => b.events - a.events);

    const checkpointData: any = await this.graphql(`{ checkpoint { networkTotalTransactions } }`);
    const networkTxTotal = Number(checkpointData.checkpoint.networkTotalTransactions);
    const daysLive = 332;
    const secondsLive = daysLive * 86400;

    return {
      l1: projects.filter((p) => p.layer === 'L1'),
      l2: projects.filter((p) => p.layer === 'L2'),
      totalProjects: projects.length,
      totalEvents: projects.reduce((sum, p) => sum + p.events, 0),
      totalStorageIota: Math.round(projects.reduce((sum, p) => sum + p.storageIota, 0) * 10000) / 10000,
      networkTxTotal,
      txRates: {
        perYear: Math.round((networkTxTotal / daysLive) * 365),
        perMonth: Math.round((networkTxTotal / daysLive) * 30),
        perWeek: Math.round((networkTxTotal / daysLive) * 7),
        perDay: Math.round(networkTxTotal / daysLive),
        perHour: Math.round(networkTxTotal / (daysLive * 24)),
        perMinute: Math.round(networkTxTotal / (daysLive * 24 * 60)),
        perSecond: Math.round((networkTxTotal / secondsLive) * 100) / 100,
      },
    };
  }
}
