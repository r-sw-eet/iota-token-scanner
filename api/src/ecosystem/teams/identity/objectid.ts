import { Team } from '../team.interface';

export const objectid: Team = {
  id: 'objectid',
  name: 'ObjectID',
  description: 'RWA / product-authenticity platform. Core identity + document anchoring + GS1 hub for linking physical goods (via GS1 codes) to on-chain attestations.',
  urls: [
    { label: 'Website', href: 'https://objectid.io' },
    { label: 'IOTA showcase', href: 'https://www.iota.org/learn/showcases/objectID' },
  ],
  deployers: [
    '0x59dadd46e10bc3d890a0d20aa3fd1a460110eab5d368922ac1db02883434cc43',
    '0xbca71c7ae4b8f78e8ac038c4c8aca89d74432a6def0d6395cc5b5c898c66b596',
  ],
  attribution: `
Previously registered as "OID Identity" based only on the \`oid_*\` module prefix. Verified as ObjectID via the IOTA Foundation showcase page (iota.org/learn/showcases/objectID) and the product site at objectid.io, which describe a product-authenticity / RWA platform linking GS1-coded physical goods to on-chain attestations (document anchoring, credit primitives, GS1 hub). Two deployer keys publish the full 12-package footprint: core identity/credit + documents + allowlist/config utilities + the OIDGs1IHub package.
`.trim(),
};
