import { ProjectDefinition } from '../project.interface';

export const identityWot: ProjectDefinition = {
  name: 'Identity (WoT)',
  layer: 'L1',
  category: 'Identity',
  description: 'Web of Trust identity system on IOTA Rebased. Enables decentralized identity verification where trust relationships between entities are recorded on-chain, forming a verifiable trust graph.',
  urls: [],
  teamId: 'iota-foundation',
  match: { all: ['wot_identity', 'wot_trust'] },
  attribution: `
On-chain evidence: Move package with both \`wot_identity\` and \`wot_trust\` modules (and not the \`file_vault\` / \`mailbox\` of the full deployment — the registry's match order in ALL_PROJECTS puts \`identityFull\` first, so this rule only fires when the fuller signature doesn't match).

Lighter IF identity deployment — WoT-only, without the file vault / mailbox add-ons. "Identity (WoT)" is our disambiguator. Same IOTA Foundation team.
`.trim(),
};
