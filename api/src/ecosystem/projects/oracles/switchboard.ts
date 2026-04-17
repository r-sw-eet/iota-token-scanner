import { ProjectDefinition } from '../project.interface';

export const switchboardOracle: ProjectDefinition = {
  name: 'Switchboard Oracle',
  layer: 'L1',
  category: 'Oracle',
  description: 'Switchboard decentralized oracle network on IOTA Rebased. Provides customizable data feeds with configurable aggregation, guardian queues, and on-demand oracle functionality for smart contracts.',
  urls: [
    { label: 'Website', href: 'https://switchboard.xyz' },
  ],
  teamId: 'switchboard',
  match: { all: ['aggregator', 'aggregator_init_action'], minModules: 10 },
  attribution: `
On-chain evidence: Move package with both \`aggregator\` and \`aggregator_init_action\`, and the package has at least 10 modules total.

Switchboard uses an aggregator-based oracle design; the module pair is distinctive enough on its own, but \`aggregator\` is a common enough name elsewhere that we added a \`minModules: 10\` guard to avoid false positives from small one-off contracts. Switchboard's IOTA deployment is publicly documented on switchboard.xyz; the known deployer is their core oracle deployer.
`.trim(),
};
