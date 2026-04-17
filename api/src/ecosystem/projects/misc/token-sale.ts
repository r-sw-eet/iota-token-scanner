import { ProjectDefinition } from '../project.interface';

export const tokenSale: ProjectDefinition = {
  name: 'Token Sale',
  layer: 'L1',
  category: 'Token Sale',
  description: 'Token sale and launchpad platform on IOTA Rebased. Supports multi-coin purchases with configurable sale parameters for project token distribution events.',
  urls: [],
  teamId: 'studio-0a0d',
  match: { any: ['spec_sale_multicoin', 'spec_sale_v2'] },
  attribution: `
On-chain evidence: Move package containing at least one of \`spec_sale_multicoin\` or \`spec_sale_v2\`.

"Token Sale" is our descriptive label. The two module names correspond to the v1 (multicoin) and v2 iterations of the same launchpad contract — \`module:any\` match covers both. Deployed by Studio 0x0a0d4c9a (same anonymous studio as Marketplace Escrow).
`.trim(),
};
