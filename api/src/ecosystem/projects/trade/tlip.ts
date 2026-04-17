import { ProjectDefinition } from '../project.interface';

export const tlip: ProjectDefinition = {
  name: 'TLIP (Trade)',
  layer: 'L1',
  category: 'Trade Finance',
  description: 'Trade Logistics Information Pipeline — the IOTA Foundation\'s flagship trade digitization project. Handles electronic Bills of Lading (eBL), carrier registries, and endorsement chains for cross-border shipments. Part of the ADAPT initiative in Kenya, Ghana, and Rwanda.',
  urls: [
    { label: 'Website', href: 'https://tlip.io' },
    { label: 'IOTA Foundation', href: 'https://www.iota.org/solutions/trade' },
  ],
  teamId: 'if-tlip',
  match: {
    packageAddresses: ['0xdeadee97bb146c273e9cc55ec26c1d2936133119acc1b2fc0b542e279007e108'],
    all: ['ebl'],
  },
  attribution: `
On-chain evidence:
- Hardcoded package address \`0xdeadee97…e108\`.
- Package also contains a module named \`ebl\` (electronic Bill of Lading — TLIP's core primitive).

TLIP (Trade Logistics Information Pipeline) is the IOTA Foundation's flagship trade-digitization project, publicly documented at tlip.io and iota.org/solutions/trade. Kept as its own team (\`if-tlip\`) rather than merging into \`iota-foundation\` because TLIP is marketed as a distinct product with its own domain. The \`ebl\` module name is specific enough to TLIP that the module match doubles as a sanity check on the hardcoded address.
`.trim(),
};
