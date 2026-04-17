import { Team } from '../team.interface';

export const studioB8b1: Team = {
  id: 'studio-b8b1',
  name: 'Studio 0xb8b1380e',
  description: 'Prolific anonymous developer — games (Chess, Tic-Tac-Toe, 2048), Gift Drop, and Vault.',
  deployers: ['0xb8b1380eb2f879440e6f568edbc3aab46b54c48b8bfe81acbc1b4cf15a2706c6'],
  attribution: `
Anonymous developer we've identified only by their deployer prefix (\`0xb8b1380e…\`). The team name "Studio 0xb8b1380e" is synthetic — we coined it from the address because no public brand is attached to the contracts. Grouped together because the same deployer ships multiple small on-chain games and utility packages (Chess, Tic-Tac-Toe, 2048, Gift Drop, Vault). If we ever identify the real team behind this address, rename here and migrate projects.
`.trim(),
};

export const studio0a0d: Team = {
  id: 'studio-0a0d',
  name: 'Studio 0x0a0d4c9a',
  description: 'Anonymous deployer behind Marketplace Escrow + Token Sale contracts.',
  deployers: ['0x0a0d4c9a9f935dac9f9bee55ca0632c187077a04d0dffcc479402f2de9a82140'],
  attribution: `
Same pattern as Studio 0xb8b1380e — anonymous developer, synthetic name derived from deployer prefix. This studio ships the Marketplace Escrow and Token Sale packages.
`.trim(),
};
