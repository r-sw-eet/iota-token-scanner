import { ProjectDefinition } from '../project.interface';

export const ibtcBridge: ProjectDefinition = {
  name: 'iBTC Bridge',
  layer: 'L1',
  category: 'Bridge',
  description: 'Bitcoin bridge to IOTA Rebased. Enables trustless transfer of BTC value onto the IOTA network as iBTC tokens, secured by a committee-based custody model with rate limiting and multi-sig treasury.',
  urls: [],
  teamId: 'ibtc',
  match: { all: ['ibtc', 'bridge'] },
  attribution: `
On-chain evidence: Move package with both \`ibtc\` and \`bridge\` modules.

"iBTC" is a publicly-announced Bitcoin bridge to IOTA Rebased. The module pair \`ibtc\` + \`bridge\` is a literal naming match for the product, deployed by a single known address. No canonical press page is currently linked from IOTA Foundation ecosystem listings, so deployer identity is the main anchor — if a second party ever deployed a package with this exact module pair, we'd have an anomaly log to investigate.
`.trim(),
};
