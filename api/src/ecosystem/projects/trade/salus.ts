import { ProjectDefinition } from '../project.interface';

export const salus: ProjectDefinition = {
  name: 'Salus Platform',
  layer: 'L1',
  category: 'Trade Finance',
  description: 'Tokenizes physical commodities — metal ore, raw materials — as Digital Warehouse Receipts (DWRs) on IOTA mainnet. Each NFT anchors a SHA-384 hash of the off-chain document, proving authenticity without storing the file on-chain. Supports financing, marketplace listings, and title transfers of commodity-backed assets.',
  urls: [
    { label: 'Platform', href: 'https://salusplatform.com' },
    { label: 'Beta Nexus', href: 'https://nexus-beta.salusplatform.com' },
  ],
  teamId: 'salus',
  match: {
    packageAddresses: ['0xf5e4f55993ef59fe3b61da5e054ea2a060cd78e34ca47506486ac8a7c9c7a90f'],
    fingerprint: {
      type: 'nft::NFT',
      issuer: '0x4876d3fca2cb61ce39d4f920ad0705f5921995642c69201ee5adfa8f94c34225',
      tag: 'salus',
    },
  },
  attribution: `
On-chain evidence:
- Primary: package at exact address \`0xf5e4…a90f\`.
- Fingerprint (for catching upgraded/new Salus packages automatically): a Move object of type \`<pkg>::nft::NFT\` whose \`issuer\` field equals Salus's deployer and whose \`tag\` field equals \`"salus"\`.

Salus Platform tokenizes physical commodities (metal ore, raw materials) as Digital Warehouse Receipts on IOTA. The address is hardcoded because Salus publishes discrete product packages; the fingerprint catches future deployments from the same issuer under the same \`tag="salus"\` marker. Confirmed from salusplatform.com, which openly references their IOTA mainnet deployment.
`.trim(),
};
