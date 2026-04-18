import { Team } from '../team.interface';

export const boltEarth: Team = {
  id: 'bolt-earth',
  name: 'Bolt.Earth',
  description: 'DePIN / RealFi protocol tokenizing revenue shares of physical EV-charging stations. "Station" on-chain = a real-world charging point onboarded to the network.',
  urls: [{ label: 'Website', href: 'https://bolt.earth' }],
  deployers: ['0x1d4ec616351c6be450771d2b291c41579177218da6c5735f2c80af8661f36da3'],
  attribution: `
Single-deployer team. Module pair \`bolt\` + \`station\` maps cleanly to Bolt.Earth's product: a DePIN/RealFi protocol tokenizing revenue shares of EV charging stations. Previously labeled "Bolt Protocol" in the registry — the real brand is Bolt.Earth, and the category is DePIN/RWA rather than a generic "Protocol" row.
`.trim(),
};
