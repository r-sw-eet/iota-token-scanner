import { ProjectDefinition } from '../project.interface';

export const marketplaceEscrow: ProjectDefinition = {
  name: 'Marketplace Escrow',
  layer: 'L1',
  category: 'Marketplace',
  description: 'Full-featured marketplace escrow system on IOTA with dispute resolution via quorum voting, milestone-based payments, reputation tracking, and mutual cancellation. Supports order and listing deposit flows.',
  urls: [],
  teamId: 'studio-0a0d',
  match: { all: ['dispute_quorum', 'escrow'] },
  attribution: `
On-chain evidence: Move package with both \`dispute_quorum\` and \`escrow\` modules.

"Marketplace Escrow" is our descriptive label — the module names describe the functionality (escrowed transactions resolved by quorum voting on disputes). Deployed by Studio 0x0a0d4c9a, another anonymous studio; we haven't identified a public brand attached to the contract so the team is labeled by deployer prefix.
`.trim(),
};
