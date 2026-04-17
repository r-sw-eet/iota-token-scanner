import { Team } from '../team.interface';

export const boltProtocol: Team = {
  id: 'bolt-protocol',
  name: 'Bolt Protocol',
  deployers: ['0x1d4ec616351c6be450771d2b291c41579177218da6c5735f2c80af8661f36da3'],
  attribution: `
Single-deployer team matching the \`bolt\` + \`station\` module pair. No public source URL linked yet; attribution rests on the module-name signature and the isolated nature of the deployer.
`.trim(),
};
