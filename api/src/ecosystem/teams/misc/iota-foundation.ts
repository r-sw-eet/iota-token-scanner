import { Team } from '../team.interface';

/**
 * Consolidated IOTA Foundation team. Owns the chain primitives (system packages
 * 0x1 / 0x2 / 0x3), the identity stack (Identity, WoT, Credentials),
 * Notarization, and Traceability. The projects remain split in the UI so each
 * product line has its own row; the team attribution unifies them here.
 *
 * TLIP is intentionally kept as a separate team (`if-tlip`) because it's
 * positioned as a distinct public product with its own domain (tlip.io).
 * `if-testing` is also kept separate — its single-project team is what enables
 * team-deployer routing out of the NFT Collections aggregate bucket.
 */
export const iotaFoundation: Team = {
  id: 'iota-foundation',
  name: 'IOTA Foundation',
  description: 'IOTA Foundation — owns the chain primitives (system packages 0x2 / 0x3) plus the Identity, Notarization, and Traceability product lines on IOTA Rebased.',
  urls: [{ label: 'IOTA Foundation', href: 'https://www.iota.org' }],
  deployers: [
    // Identity stack (was `if-identity`)
    '0x45745c3d1ef637cb8c920e2bbc8b05ae2f8dbeb28fd6fb601aea92a31f35408f',
    // Notarization (was `if-notarization`)
    '0x56afb2eded3fb2cdb73f63f31d0d979c1527804144eb682c142eb93d43786c8f',
    '0xedb0c77b6393a11b4c29b7914410e468680e3bc8110e99a40c203038c9335fc2',
    // Traceability (was `if-traceability`)
    '0x46365ba3a2eab8639d41f8ff2be3adf50e384db5c7d81b0d726bfea5674fb3f5',
    '0x8009891c7a1f173f03b72a674c9a65016c65250813b00f0b20df8d23f1c8a639',
    '0xd604621407ca777658c5834c90c36a432b38f9ace39fe951a87c03f800515bbe',
    // Chain primitives: system packages 0x2 / 0x3 have no conventional deployer
    // and are matched by package address, not by deployer.
  ],
};
