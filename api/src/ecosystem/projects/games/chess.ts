import { ProjectDefinition } from '../project.interface';

export const chess: ProjectDefinition = {
  name: 'Chess',
  layer: 'L1',
  category: 'Game',
  description: 'Fully on-chain chess game where every move is recorded as a transaction on IOTA Rebased. Players compete in verifiable matches with game state stored as Move objects.',
  urls: [],
  teamId: 'studio-b8b1',
  match: { all: ['chess'] },
  attribution: `
On-chain evidence: Move package with module \`chess\`.

"Chess" is our descriptive label — the module name is literal, and the deployer is Studio 0xb8b1380e, an anonymous but prolific developer we've identified by deployer prefix. The same studio ships Tic-Tac-Toe, 2048, Gift Drop, and the Vault module, so we grouped them under a single synthetic studio team.
`.trim(),
};
