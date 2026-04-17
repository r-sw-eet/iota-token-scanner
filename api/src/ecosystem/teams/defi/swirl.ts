import { Team } from '../team.interface';

export const swirl: Team = {
  id: 'swirl',
  name: 'Swirl',
  description: 'Liquid staking on IOTA.',
  deployers: ['0x043b7d4d89c36bfcd37510aadadb90275622cf603344f39b29648c543742351c'],
  logo: '/logos/swirl.svg',
  attribution: `
Deployer identified by inspecting the swirlstake.com web app — its stake/unstake flows call into packages published from \`0x043b…351c\`. Swirl's own docs (docs.swirlstake.com) describe the \`pool\`/\`riota\` module split that matches what the deployer ships on-chain.
`.trim(),
};
