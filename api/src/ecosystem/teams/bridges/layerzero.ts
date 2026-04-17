import { Team } from '../team.interface';

export const layerzero: Team = {
  id: 'layerzero',
  name: 'LayerZero',
  description: 'LayerZero core endpoint protocol on IOTA.',
  urls: [{ label: 'Website', href: 'https://layerzero.network' }],
  deployers: ['0x8a81a6096a81fe2b722541bc19eb30e6c025732638375c362f07ea48979fd30a'],
  logo: '/logos/layerzero.png',
  attribution: `
Deployer \`0x8a81…d30a\` is LayerZero's IOTA endpoint deployer — identifiable from LayerZero's public deployment manifests/docs at layerzero.network (every supported chain publishes the endpoint contract address). LayerZero OFT tokens are NOT routed to this team; they're deployed by third parties (e.g. Virtue) and live in the \`layerZeroOft\` aggregate bucket instead.
`.trim(),
};
