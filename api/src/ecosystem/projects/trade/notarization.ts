import { ProjectDefinition } from '../project.interface';

export const notarization: ProjectDefinition = {
  name: 'Notarization',
  layer: 'L1',
  category: 'Notarization',
  description: 'On-chain document notarization service on IOTA Rebased. Supports dynamic and locked notarization modes, with timelock capabilities. Documents are anchored on-chain with cryptographic proofs of existence and timestamps.',
  urls: [],
  teamId: 'iota-foundation',
  match: { all: ['dynamic_notarization'] },
  attribution: `
On-chain evidence: Move package with module \`dynamic_notarization\`.

On-chain document notarization is one of the IOTA Foundation's flagship enterprise use cases (see iota.org). \`dynamic_notarization\` is IF-specific terminology for their mutable notarization flavor (as opposed to locked/immutable notarization). Attributed to the consolidated \`iota-foundation\` team via IF deployer addresses.
`.trim(),
};
