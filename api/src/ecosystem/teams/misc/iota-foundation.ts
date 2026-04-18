import { Team } from '../team.interface';

/**
 * Consolidated IOTA Foundation team. Owns the chain primitives (system packages
 * 0x1 / 0x2 / 0x3), the identity stack (Identity, WoT, Credentials), the
 * Identity Asset Framework, the Accreditation Registry, Notarization, and
 * Traceability. The projects remain split in the UI so each product line has
 * its own row; the team attribution unifies them here.
 *
 * TLIP is intentionally kept as a separate team (`tlip`) because it's
 * positioned as a distinct public product with its own domain (tlip.io) and
 * TMEA partnership. TWIN Foundation is also separate — it's the Swiss
 * parent-foundation above TLIP, with its own deployer and brand.
 * `if-testing` is also kept separate — its single-project team is what enables
 * team-deployer routing out of the NFT Collections aggregate bucket.
 */
export const iotaFoundation: Team = {
  id: 'iota-foundation',
  name: 'IOTA Foundation',
  description: 'IOTA Foundation — owns the chain primitives (system packages 0x2 / 0x3) plus the Identity, Identity Asset Framework, Accreditation Registry, Notarization, and Traceability product lines on IOTA Rebased.',
  urls: [{ label: 'IOTA Foundation', href: 'https://www.iota.org' }],
  logo: '/logos/iota.svg',
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
  attribution: `
Consolidated team covering the IOTA Foundation's chain-primitive packages plus their Identity, Identity Asset Framework, Accreditation Registry, Notarization, and Traceability product lines. All deployers are IF-operated addresses identified from IF-published documentation (iota.org/products, github.com/iotaledger/notarization, the IOTA Identity developer docs) and cross-referenced against the module signatures we match (Identity modules, \`dynamic_notarization\`, \`asset\` + \`multicontroller\` for the Identity Asset Framework, \`accreditation\` + \`property\` for the Accreditation Registry, \`traceability\`). Chain primitives (\`0x0…0002\`, \`0x0…0003\`) are matched by literal address — genesis-installed system packages have no conventional deployer.

The Notarization deployer \`0x56af…6c8f\` ships four packages: the core \`dynamic_notarization\` (Notarization row), the 16/17-module Identity Asset Framework (new row 2026-04-18), and the 7-module Accreditation Registry (new row 2026-04-18). All three are IF products but distinct enough to warrant separate rows.

Carve-outs: \`tlip\` stays separate because TLIP is a distinct public brand with TMEA partnership; \`twin-foundation\` stays separate because TWIN is the Swiss parent-foundation with its own deployer (\`0x164625aa…\`) and generic \`verifiable_storage\` anchor; \`if-testing\` stays separate because its single-project setup is what enables the NFT Collections → IF Testing deployer-routing rule.
`.trim(),
};
