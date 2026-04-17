import { Team } from '../team.interface';

export const ibtc: Team = {
  id: 'ibtc',
  name: 'iBTC',
  description: 'Bitcoin bridge for IOTA.',
  deployers: ['0x95ec54247e108d3a15be965c5723fee29de62ab445c002fc1b8a48bfc6fb281e'],
  attribution: `
Single-deployer team. Deployer \`0x95ec…281e\` publishes the \`ibtc\`/\`bridge\` package that matches iBTC's Bitcoin-bridge product description. We haven't yet linked a public source URL (official site / docs) for iBTC, so attribution rests on the module-name match plus the fact that no competing deployer has published a package with that module pair.
`.trim(),
};
