import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import request from 'supertest';
import { Model } from 'mongoose';
import { bootApp, stopApp } from './boot-app';
import { EcosystemSnapshot } from '../src/ecosystem/schemas/ecosystem-snapshot.schema';

describe('Ecosystem (functional)', () => {
  let app: INestApplication;
  let ecoModel: Model<EcosystemSnapshot>;

  beforeAll(async () => {
    app = await bootApp();
    ecoModel = app.get(getModelToken(EcosystemSnapshot.name));
  });

  afterAll(() => stopApp());

  afterEach(async () => {
    await ecoModel.deleteMany({});
  });

  const seed = () =>
    ecoModel.create({
      l1: [
        {
          slug: 'aa-tlip-trade',
          name: 'TLIP (Trade)',
          layer: 'L1',
          category: 'Trade Finance',
          description: 'Test',
          packageAddress: '0xaa',
          latestPackageAddress: '0xaa',
          packages: 1,
          storageIota: 0,
          events: 10,
          eventsCapped: false,
          modules: ['ebl'],
          tvl: 0,
          team: { id: 'if-tlip', name: 'IOTA Foundation (TLIP)' },
          urls: [],
        },
      ],
      l2: [
        {
          slug: 'evm-somedex',
          name: 'SomeDex',
          layer: 'L2',
          category: 'Dexs',
          description: 'Test L2',
          modules: [],
          packages: 0,
          storageIota: 0,
          events: 0,
          eventsCapped: false,
          tvl: 500_000,
          team: null,
          urls: [],
        },
      ],
      totalProjects: 2,
      totalEvents: 10,
      totalStorageIota: 0,
      networkTxTotal: 1_000_000,
      txRates: { perDay: 10_000 },
    });

  describe('GET /ecosystem', () => {
    it('returns an empty structure when no snapshot exists', async () => {
      const res = await request(app.getHttpServer()).get('/ecosystem').expect(200);
      expect(res.body).toMatchObject({ l1: [], l2: [], totalProjects: 0 });
    });

    it('returns the stored snapshot', async () => {
      await seed();
      const res = await request(app.getHttpServer()).get('/ecosystem').expect(200);
      expect(res.body.totalProjects).toBe(2);
      expect(res.body.l1).toHaveLength(1);
      expect(res.body.l2).toHaveLength(1);
    });
  });

  describe('GET /ecosystem/teams', () => {
    it('lists all teams with their matching projects', async () => {
      await seed();
      const res = await request(app.getHttpServer()).get('/ecosystem/teams').expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      const tlipTeam = res.body.find((t: any) => t.id === 'if-tlip');
      expect(tlipTeam).toBeDefined();
      expect(tlipTeam.projects).toEqual([
        { slug: 'aa-tlip-trade', name: 'TLIP (Trade)', category: 'Trade Finance', layer: 'L1' },
      ]);
    });
  });

  describe('GET /ecosystem/teams/:id', () => {
    it('returns a single team with its projects', async () => {
      await seed();
      const res = await request(app.getHttpServer())
        .get('/ecosystem/teams/if-tlip')
        .expect(200);
      expect(res.body.id).toBe('if-tlip');
      expect(res.body.projects).toHaveLength(1);
    });

    it('404s on unknown team id', async () => {
      await seed();
      await request(app.getHttpServer()).get('/ecosystem/teams/does-not-exist').expect(404);
    });
  });

  describe('GET /ecosystem/project/:slug', () => {
    it('returns the matching project', async () => {
      await seed();
      const res = await request(app.getHttpServer())
        .get('/ecosystem/project/aa-tlip-trade')
        .expect(200);
      expect(res.body.name).toBe('TLIP (Trade)');
    });

    it('404s when the slug is unknown', async () => {
      await seed();
      await request(app.getHttpServer()).get('/ecosystem/project/ghost').expect(404);
    });

    it('404s when no ecosystem data exists at all', async () => {
      await request(app.getHttpServer()).get('/ecosystem/project/anything').expect(404);
    });
  });

  describe('GET /ecosystem/project/:slug/events', () => {
    it('returns empty events with a note for L2 projects without a package', async () => {
      await seed();
      const res = await request(app.getHttpServer())
        .get('/ecosystem/project/evm-somedex/events')
        .expect(200);
      expect(res.body).toEqual({ events: [], module: null, note: 'No on-chain package for this project' });
    });

    it('404s for unknown slugs', async () => {
      await seed();
      await request(app.getHttpServer()).get('/ecosystem/project/ghost/events').expect(404);
    });
  });
});
