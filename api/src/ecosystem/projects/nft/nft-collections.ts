import { ProjectDefinition } from '../project.interface';

export const nftCollections: ProjectDefinition = {
  name: 'NFT Collections',
  layer: 'L1',
  category: 'NFT',
  description: 'Generic NFT minting contracts deployed on IOTA Rebased. Includes 135+ individual collection packages using a shared single-module NFT standard.',
  urls: [],
  match: { exact: ['nft'] },
};
