import { ProjectDefinition } from '../project.interface';

export const staking: ProjectDefinition = {
  name: 'Staking',
  layer: 'L1',
  category: 'Staking',
  description: 'Custom staking contracts on IOTA Rebased with configurable parameters. Enables projects to offer their own staking programs with custom reward schedules and entry/exit conditions.',
  urls: [],
  teamId: 'staking-generic',
  match: { all: ['stake', 'stake_config'] },
  attribution: `
On-chain evidence: Move package with both \`stake\` and \`stake_config\` modules.

"Staking" is a generic descriptor — module names are literal, and the deployer isn't tied to a branded project we've identified. The team \`staking-generic\` exists as a catch-all for this configurable-staking contract; if the deployer turns out to belong to a known team, we'd reassign.
`.trim(),
};
