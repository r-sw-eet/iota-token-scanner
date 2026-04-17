import { ProjectDefinition } from '../project.interface';

export const gambling: ProjectDefinition = {
  name: 'Gambling',
  layer: 'L1',
  category: 'Gambling',
  description: 'On-chain coin flip and roulette games on IOTA Rebased. Uses verifiable randomness to ensure fair outcomes, with all bets and results recorded as transactions.',
  urls: [],
  teamId: 'gambling',
  match: { all: ['iota_flip', 'roulette'] },
  attribution: `
On-chain evidence: Move package with both \`iota_flip\` and \`roulette\` modules.

Coin-flip + roulette betting contracts — the module names are literal. The deployer ships both games together; no public brand is attached, so we label the team "IOTA Flip / Roulette" as a descriptor, not as an official product name.
`.trim(),
};
