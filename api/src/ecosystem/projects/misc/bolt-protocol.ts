import { ProjectDefinition } from '../project.interface';

export const boltProtocol: ProjectDefinition = {
  name: 'Bolt Protocol',
  layer: 'L1',
  category: 'Protocol',
  description: 'Bolt network protocol on IOTA Rebased. Manages station registries, share tokenization, and proxy contracts for a decentralized network of service nodes.',
  urls: [],
  teamId: 'bolt-protocol',
  match: { all: ['bolt', 'station'] },
  attribution: `
On-chain evidence: Move package with both \`bolt\` and \`station\` modules.

Bolt Protocol uses "stations" as the core unit in its decentralized service-node network (station registries, share tokenization, proxies). The module pair is an unambiguous signature for the project. Team attribution via the single known Bolt deployer. No public source URL is yet linked in the registry.
`.trim(),
};
