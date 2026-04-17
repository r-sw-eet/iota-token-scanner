import { ProjectDefinition } from '../project.interface';

export const credentials: ProjectDefinition = {
  name: 'Credentials',
  layer: 'L1',
  category: 'Identity',
  description: 'Verifiable credentials protocol on IOTA Rebased. Issues, holds, and verifies digital credentials with on-chain trust anchors. Enables portable identity attestations across applications.',
  urls: [],
  teamId: 'iota-foundation',
  match: { exact: ['credentials', 'identity', 'trust'] },
  attribution: `
On-chain evidence: Move package whose module set is exactly \`{credentials, identity, trust}\`.

Part of the IOTA Foundation identity stack. The three-module exact-set signature differentiates it from the broader Identity (full) package. "Credentials" is our descriptive name; the IF identity team doesn't market this as a standalone product separately from their other identity offerings. Routed to the consolidated \`iota-foundation\` team.
`.trim(),
};
