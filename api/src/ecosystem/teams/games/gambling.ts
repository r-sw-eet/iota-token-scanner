import { Team } from '../team.interface';

export const gambling: Team = {
  id: 'gambling',
  name: 'IOTA Flip / Roulette',
  description: 'On-chain gambling contracts.',
  deployers: ['0xbe95685023788ea57c6633564eab3fb919847ecd1234448e38e8951fbd4b6654'],
  attribution: `
Anonymous deployer shipping coin-flip and roulette gambling contracts. "IOTA Flip / Roulette" is our descriptive label — there's no public brand attached to the contract. Single known deployer; not identified with any real-world organization.
`.trim(),
};
