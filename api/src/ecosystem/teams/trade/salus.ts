import { Team } from '../team.interface';

export const salus: Team = {
  id: 'salus',
  name: 'Salus Platform',
  description: 'Commodity tokenization — Digital Warehouse Receipts (DWRs) as NFTs with SHA-384 doc anchoring.',
  urls: [
    { label: 'Platform', href: 'https://salusplatform.com' },
    { label: 'Beta Nexus', href: 'https://nexus-beta.salusplatform.com' },
  ],
  deployers: ['0x4876d3fca2cb61ce39d4f920ad0705f5921995642c69201ee5adfa8f94c34225'],
  logo: '/logos/salus.png',
  attribution: `
Deployer \`0x4876…4225\` publishes Salus's DWR (Digital Warehouse Receipt) NFT contracts. Salus Platform's own site (salusplatform.com) references their IOTA mainnet deployment; we additionally use this deployer as the \`issuer\` field in the fingerprint rule that catches new Salus packages automatically.
`.trim(),
};
