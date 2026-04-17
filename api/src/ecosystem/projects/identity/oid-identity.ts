import { ProjectDefinition } from '../project.interface';

export const oidIdentity: ProjectDefinition = {
  name: 'OID Identity',
  layer: 'L1',
  category: 'Identity',
  description: 'Object Identity system on IOTA Rebased. Assigns verifiable identities to on-chain objects with an associated credit system for reputation and access control.',
  urls: [],
  teamId: 'oid',
  match: { all: ['oid_credit', 'oid_identity'] },
  attribution: `
On-chain evidence: Move package with both \`oid_credit\` and \`oid_identity\` modules.

Third-party on-chain identity + credit-scoring project distinct from the IOTA Foundation identity stack. "OID" is literal in the module names. Two deployer addresses publish the product's packages; we haven't linked a public source URL yet.
`.trim(),
};
