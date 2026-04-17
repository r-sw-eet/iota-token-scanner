import { ProjectDefinition } from '../project.interface';

export const tradeport: ProjectDefinition = {
  name: 'Tradeport',
  layer: 'L1',
  category: 'NFT Marketplace',
  description: 'NFT marketplace on IOTA Rebased supporting bidding, listings, and trading of digital collectibles. Part of the broader Tradeport multi-chain NFT platform.',
  urls: [
    { label: 'Website', href: 'https://tradeport.xyz' },
  ],
  teamId: 'tradeport',
  match: { all: ['tradeport_biddings'] },
  attribution: `
On-chain evidence: Move package with module \`tradeport_biddings\`.

\`tradeport_biddings\` is literally Tradeport's product name baked into the module identifier — an unambiguous signature. Tradeport is a multi-chain NFT marketplace that lists IOTA as a supported chain on tradeport.xyz. The known deployers are the addresses Tradeport's marketplace UI calls into.
`.trim(),
};
