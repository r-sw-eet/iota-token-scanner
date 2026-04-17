import { ProjectDefinition } from '../project.interface';

export const game2048: ProjectDefinition = {
  name: '2048 Game',
  layer: 'L1',
  category: 'Game',
  description: 'On-chain version of the classic 2048 puzzle game with campaign rewards. Players earn rewards for high scores, with game state and achievements stored on the IOTA ledger.',
  urls: [],
  teamId: 'studio-b8b1',
  match: { all: ['campaign_rewards', 'game_2048'] },
  attribution: `
On-chain evidence: Move package with both \`campaign_rewards\` and \`game_2048\` modules.

"2048 Game" is our descriptive label — \`game_2048\` is the literal module name, and \`campaign_rewards\` indicates the studio added a reward layer on top (score → on-chain points/rewards). Same Studio 0xb8b1380e deployer as the other on-chain games.
`.trim(),
};
