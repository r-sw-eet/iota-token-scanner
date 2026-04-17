import { Team } from '../team.interface';

export const easyPublish: Team = {
  id: 'easy-publish',
  name: 'Easy Publish',
  deployers: ['0x0dce85b04ae7d67de5c6785f329aac1c429cd9321724d64ba5961d347575db97'],
  attribution: `
Single-deployer team for a developer-tooling package. The module name \`easy_publish\` is the brand the deployer uses — no external source linked yet.
`.trim(),
};
