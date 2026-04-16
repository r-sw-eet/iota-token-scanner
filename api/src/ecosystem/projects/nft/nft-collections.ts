import { ProjectDefinition } from '../project.interface';

export const nftCollections: ProjectDefinition = {
  name: 'NFT Collections',
  layer: 'L1',
  category: 'NFT',
  description: 'Generic NFT minting contracts deployed on IOTA Rebased. Includes 135+ individual collection packages using a shared single-module NFT standard.',
  urls: [],
  teamId: null,
  disclaimer: "Aggregate bucket split by deployer — each sub-project represents all NFT-minting packages published by a single address, identified by a short hash of that deployer. Display name is enriched with a sample NFT's `tag` or `name` field when available.",
  splitByDeployer: true,
  match: { exact: ['nft'] },
};
