import { ProjectDefinition } from '../project.interface';

export const ifTesting: ProjectDefinition = {
  name: 'IOTA Foundation (Testing)',
  layer: 'L1',
  category: 'Testing',
  description: 'Internal test deployments by the IOTA Foundation — gas station validation, transfer tests, and comparison packages. Packages share the single-module `nft` pattern; NFT instances carry tags like `gas_station_*`, `transfer_test`, `regular_comparison`. Packages reach this project exclusively via deployer-based team routing out of the NFT Collections aggregate bucket — the module matcher intentionally claims nothing directly.',
  urls: [{ label: 'IOTA Foundation', href: 'https://www.iota.org' }],
  teamId: 'if-testing',
  match: {},
};
