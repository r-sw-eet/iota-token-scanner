import { ProjectDefinition } from '../project.interface';

export const oidIdentity: ProjectDefinition = {
  name: 'OID Identity',
  layer: 'L1',
  category: 'Identity',
  description: 'Object Identity system on IOTA Rebased. Assigns verifiable identities to on-chain objects with an associated credit system for reputation and access control.',
  urls: [],
  match: { all: ['oid_credit', 'oid_identity'] },
};
