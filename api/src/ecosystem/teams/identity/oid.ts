import { Team } from '../team.interface';

export const oid: Team = {
  id: 'oid',
  name: 'OID Identity',
  description: 'On-chain identity and credit scoring.',
  deployers: [
    '0x59dadd46e10bc3d890a0d20aa3fd1a460110eab5d368922ac1db02883434cc43',
    '0xbca71c7ae4b8f78e8ac038c4c8aca89d74432a6def0d6395cc5b5c898c66b596',
  ],
  attribution: `
Two deployers publishing the \`oid_credit\` + \`oid_identity\` package set. "OID Identity" is inferred from the module-name prefix \`oid_*\`; we haven't linked a public source URL yet, so the team name itself is provisional and the deployer addresses are the primary anchor.
`.trim(),
};
