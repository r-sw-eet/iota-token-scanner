import { ProjectDefinition } from '../project.interface';

export const traceability: ProjectDefinition = {
  name: 'Traceability',
  layer: 'L1',
  category: 'Supply Chain',
  description: 'Product traceability contracts on IOTA Rebased. Designed for tracking goods through supply chains with immutable on-chain records of provenance, handling, and certification.',
  urls: [],
  teamId: 'iota-foundation',
  match: { all: ['traceability'] },
  attribution: `
On-chain evidence: Move package with module \`traceability\`.

Supply-chain traceability is one of the IOTA Foundation's flagship enterprise use cases (see iota.org/solutions/trade). The module name is literal. Attributed to the consolidated \`iota-foundation\` team via the set of IF traceability-dedicated deployer addresses.
`.trim(),
};
