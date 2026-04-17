import { ProjectDefinition } from '../project.interface';

export const identityFull: ProjectDefinition = {
  name: 'Identity (full)',
  layer: 'L1',
  category: 'Identity',
  description: 'Comprehensive decentralized identity solution on IOTA featuring Web of Trust verification, encrypted file vault for document storage, and a mailbox system for secure peer-to-peer messaging between identities.',
  urls: [],
  teamId: 'iota-foundation',
  match: { all: ['wot_identity', 'file_vault', 'mailbox'] },
  attribution: `
On-chain evidence: Move package with \`wot_identity\`, \`file_vault\`, and \`mailbox\` modules.

The comprehensive IOTA Identity deployment — Web-of-Trust verification plus an encrypted file vault plus a mailbox for peer messaging. "Identity (full)" is our disambiguator against the lighter WoT-only deployment; IOTA Foundation doesn't use this exact phrasing publicly. All three modules ship together in the IF identity stack (see iota.org docs on decentralized identity).
`.trim(),
};
