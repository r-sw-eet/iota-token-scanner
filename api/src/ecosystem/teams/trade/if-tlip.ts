import { Team } from '../team.interface';

export const ifTlip: Team = {
  id: 'if-tlip',
  name: 'IOTA Foundation (TLIP)',
  description: 'Trade Logistics Information Pipeline — IF flagship trade digitization.',
  urls: [{ label: 'TLIP', href: 'https://tlip.io' }],
  deployers: ['0xd7e2de659109e51191f733479891c5a2e1e46476ab4bafe1f663755f145d5176'],
  logo: '/logos/tlip.svg',
  attribution: `
Deployer \`0xd7e2…5176\` is the TLIP-dedicated IF address, publishing the \`ebl\` (electronic Bill of Lading) package at the hardcoded TLIP address. Kept as its own team rather than folded into \`iota-foundation\` because TLIP is marketed as a distinct public product with its own domain (tlip.io) and its own branding for partners like the ADAPT initiative in Kenya/Ghana/Rwanda.
`.trim(),
};
