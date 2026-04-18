# ObjectID — team rename + registry expansion

## Goal

Apply two correlated registry changes:

1. Rename team `oid` → `objectid` (reflects the verified real-world
   brand — `handoff.md` → "OID Identity → ObjectID [x] VERIFIED").
2. Capture all 12 ObjectID packages on mainnet (current rule catches
   only 4 of 12; 8 are uncaptured).

This thread drafts the paste-ready `.ts` files and registry-index
diffs. No changes to `api/src/` here — application happens in the
big coordinated correction pass described in `threads.md` → Meta-
thread.

## On-chain inventory (all 12 packages)

Enumerated on 2026-04-17 by walking every `iotax_queryTransactionBlocks`
with `FromAddress` set to each deployer, collecting immutable-created
objects, then filtering to real packages via
`iota_getNormalizedMoveModulesByPackage`. The 4 non-package immutables
are CoinMetadata objects for `OID_CREDIT` (one per core-identity
version), which we can safely ignore.

### Deployer 1 — `0x59dadd46e10bc3d890a0d20aa3fd1a460110eab5d368922ac1db02883434cc43` (11 packages)

| Package address                                                      | Modules                                    | Published (UTC) |
|----------------------------------------------------------------------|--------------------------------------------|-----------------|
| `0xc3aa78fa072860b344c671d2c904e036f376876e1e4dfc82c44c12086d4e3b81` | `oid_credit`, `oid_identity`, `oid_object` | 2025-07-16      |
| `0xfb3afd146f1b7b203b90d64df5fecf28f71aa102cc89598dc0dff268e0c81a42` | `oid_credit`, `oid_identity`, `oid_object` | 2025-06-13      |
| `0xd690e9a0ed0333632aa000ba7f65af065107414f9a04f1ca5ff909179655b200` | `oid_credit`, `oid_identity`, `oid_object` | 2025-05-28      |
| `0x6399e60508027bc419c5ba01d77859dfee4c266e93c0c70e48fe7079b1c76079` | `oid_document`                             | 2026-02-17      |
| `0x23ba3cf060ea3fbb53542e1a3347ee1eb215913081fecdf1eda462c3101da556` | `oid_document`                             | 2026-01-01      |
| `0xb218da213e22051cf02e7dbe90ce337284fb0fa13d7050b333100482f637783f` | `oid_document`                             | 2026-01-01      |
| `0x6148d3674590634d59f8f972d71dd6148e014dd9c036c048d446853dd80049f4` | `oid_config`                               | 2026-02-05      |
| `0x47265daea4b23bba0968917d16aac0926baf8018cb9ffb4896a53e77bef2f9f8` | `oid_config`                               | 2025-05-28      |
| `0x229b368f5086b9030778f54dd123bb2e8debb8da559658f21f4a6fd11083e7d7` | `allowlist_rule`                           | 2025-06-25      |
| `0x2d12f6a540091c82063392611d7e1668925d618566ab4a7547662053e96cbeb0` | `utils`                                    | 2026-02-17      |
| `0x949abb7b9e90778d62a70636736a69376284f31f0e40a3e5e7003a839d72be34` | `OIDGs1IHub`                               | 2026-02-25      |

### Deployer 2 — `0xbca71c7ae4b8f78e8ac038c4c8aca89d74432a6def0d6395cc5b5c898c66b596` (1 package)

| Package address                                                      | Modules                                    | Published (UTC) |
|----------------------------------------------------------------------|--------------------------------------------|-----------------|
| `0xc6b77b8ab151fda5c98b544bda1f769e259146dc4388324e6737ecb9ab1a7465` | `oid_credit`, `oid_identity`, `oid_object` | 2025-07-30      |

### Module-signature matrix

| Signature                                | Count | Covered by current rule `{all: ['oid_credit', 'oid_identity']}`? |
|------------------------------------------|-------|------------------------------------------------------------------|
| `{oid_credit, oid_identity, oid_object}` | 4     | Yes                                                              |
| `oid_document` (single module)           | 3     | No                                                               |
| `oid_config` (single module)             | 2     | No                                                               |
| `allowlist_rule` (single module)         | 1     | No                                                               |
| `utils` (single module)                  | 1     | No                                                               |
| `OIDGs1IHub` (single module)             | 1     | No                                                               |

Current coverage: 4 of 12. Missing: 8.

### Cross-reference: ObjectID's own config JSON (self-attesting)

Every `oid_identity` entry-function call carries an inline JSON
config naming the canonical packages. Sampled from a recent tx
published by deployer 1:

```json
{
  "network": "mainnet",
  "objectPackages": ["0xc6b77b8a…a7465"],
  "utilsPackages": "0x2d12f6a5…cbeb0",
  "documentPackages": ["0x6399e605…76079"],
  "IOTAidentityPackage": "0x84cf5d12…1de08",
  "OIDidentityPackage": "0xc6b77b8a…a7465",
  "OIDcreditPackage":  "0xc6b77b8a…a7465",
  "OIDgs1Pagackage":   "0x949abb7b…2be34",
  "createOIDcontrollerCapURL": "https://api.objectid.io/api/create-OID-controllerCap",
  "graphqlProvider": "https://graphql.mainnet.iota.cafe/"
}
```

The `api.objectid.io` URL is the smoking gun — the runtime itself
is calling ObjectID's production API. The "active" package set the
team currently routes to is deployer 2's `0xc6b7…a7465` (core) +
deployer 1's doc/utils/gs1 packages; the older deployer 1 core
versions are deprecated but still on-chain.

`IOTAidentityPackage` (`0x84cf…de08`) is IOTA Identity framework,
not owned by ObjectID — it's a dependency. Not in our 12; belongs
to the `iota-foundation` team.

## Tenant directory (from `ControllerCap.linked_domain` fields)

ObjectID's framework is multi-tenant: every customer organization
gets one or more `oid_identity::ControllerCap` objects, each
carrying a `linked_domain` string pointing at the tenant's verified
DID-controlling website. The live distribution (from `handoff.md`
probe):

| Tenant domain                | ControllerCaps | Role                                               |
|------------------------------|----------------|----------------------------------------------------|
| `https://nxc.technology/`    | 9              | **NXC Technology** — power user / integrator       |
| `https://lizardmed.it/`      | 2              | **Lizard Medical Italy** — featured launch partner |
| `https://fomofox.info/`      | 1              | **FomoFox** — tenant                               |
| `https://royalprotocol.org/` | 1              | **Royal Protocol** — tenant                        |
| `https://www.opentia.com/`   | 1              | **Opentia** — tenant                               |
| `https://icoy.it/`           | 1              | **Icoy** — tenant                                  |

These are **customers of ObjectID**, not separate teams. They
belong in the ObjectID project description (showcase customer
list), not in `ALL_TEAMS`.

## Team rename — full draft file

New file: `api/src/ecosystem/teams/identity/objectid.ts` (replaces
`oid.ts`).

```ts
import { Team } from '../team.interface';

export const objectid: Team = {
  id: 'objectid',
  name: 'ObjectID',
  description: 'Blockchain-based product-authenticity platform. Tamper-proof digital twins for physical products using IOTA Identity DIDs + Move smart contracts.',
  urls: [
    { label: 'Website', href: 'https://objectid.io' },
    { label: 'IOTA Showcase', href: 'https://www.iota.org/learn/showcases/objectID' },
  ],
  deployers: [
    '0x59dadd46e10bc3d890a0d20aa3fd1a460110eab5d368922ac1db02883434cc43',
    '0xbca71c7ae4b8f78e8ac038c4c8aca89d74432a6def0d6395cc5b5c898c66b596',
  ],
  attribution: `
Two deployers publishing the full ObjectID framework (core identity, documents, config, GS1 integration hub, allowlist rule, shared utils — 12 packages total).

Real-world identity resolved via \`oid_identity::ControllerCap.linked_domain\` fields, which every tenant organization populates with their DID-controlling domain. Probing live ControllerCaps surfaced lizardmed.it (Lizard Medical Italy — ObjectID's press-confirmed launch partner), nxc.technology, fomofox.info, royalprotocol.org, opentia.com, icoy.it. The lizardmed.it match is the smoking gun: news coverage (Bitget, cryptonews) explicitly names Lizard Medical Italy as ObjectID's first onchain-verified product partner.

Additional corroboration: ObjectID has a dedicated IOTA Foundation Technology Showcase page at iota.org/learn/showcases/objectID, and an EPO patent filing on their decentralized product-ID system. The framework's config JSON (embedded in every \`oid_identity\` entry-function call) points at \`api.objectid.io\` as the runtime's control-plane URL, directly tying the on-chain contract to the ObjectID production API.
`.trim(),
};
```

Delete: `api/src/ecosystem/teams/identity/oid.ts`.

Update barrel `api/src/ecosystem/teams/identity/_index.ts`:

```ts
export { objectid } from './objectid';
```

Update `api/src/ecosystem/teams/index.ts`:

```ts
// was: import { oid } from './identity/_index';
import { objectid } from './identity/_index';
// …
// was: oid,
objectid,
```

## Project defs — recommendation: split approach

Two viable approaches. The split approach is recommended because
ObjectID's on-chain system has three distinct product surfaces
(identity framework, document workflow, GS1 interop hub) that are
meaningful to surface separately on the website. The umbrella
approach is kept as a fallback if we'd rather show one row.

### Recommended: three rows

- **ObjectID** (core) — 4 packages (`{oid_credit, oid_identity, oid_object}`).
- **ObjectID Documents** — 3 packages (`oid_document`).
- **ObjectID GS1 Hub** — 1 package (`OIDGs1IHub`).
- **+ sweep** — 4 infrastructure packages (`utils`, 2× `oid_config`,
  `allowlist_rule`) captured by a single `ObjectID Framework`
  umbrella via `packageAddresses`. These are support-layer and
  don't deserve their own row.

Total coverage: 4 + 3 + 1 + 4 = **12 of 12**.

### Project file 1 — `projects/identity/objectid.ts` (replaces `oid-identity.ts`)

```ts
import { ProjectDefinition } from '../project.interface';

export const objectid: ProjectDefinition = {
  name: 'ObjectID',
  layer: 'L1',
  category: 'RWA / Product Authenticity',
  description: 'Anti-counterfeiting and product-provenance platform on IOTA Rebased. Assigns tamper-proof digital twins to physical products via IOTA Identity DIDs and Move smart contracts; QR-scan → DID-verify → on-chain event anchoring. Multi-tenant framework with launch customer Lizard Medical Italy, and integrators NXC Technology, FomoFox, Royal Protocol, Opentia, Icoy. EPO patent filed. IOTA Foundation Technology Showcase.',
  urls: [
    { label: 'Website', href: 'https://objectid.io' },
    { label: 'IOTA Showcase', href: 'https://www.iota.org/learn/showcases/objectID' },
  ],
  teamId: 'objectid',
  match: { all: ['oid_credit', 'oid_identity', 'oid_object'] },
  attribution: `
On-chain evidence: Move package exporting all three of \`oid_credit\`, \`oid_identity\`, \`oid_object\`. Four packages across both deployers — three progressive upgrades on deployer 1 plus the current production core on deployer 2 (\`0xc6b77b8a…a7465\`), which ObjectID's own runtime config JSON names as the active \`OIDidentityPackage\`.

"OID" = ObjectID (objectid.io). Real-world identity verified via \`oid_identity::ControllerCap.linked_domain\` fields; see the team attribution note for detail.
`.trim(),
};
```

Note the tightened match rule: we now require `oid_object` in
addition to `oid_credit` + `oid_identity`. All 4 current
core-identity packages ship all three modules, so the change is a
no-op for coverage; it just makes the rule less susceptible to
future false-matches from teams that independently ship only
`oid_credit` or `oid_identity`.

### Project file 2 — `projects/identity/objectid-documents.ts` (new)

```ts
import { ProjectDefinition } from '../project.interface';

export const objectidDocuments: ProjectDefinition = {
  name: 'ObjectID Documents',
  layer: 'L1',
  category: 'RWA / Product Authenticity',
  description: 'Signed-document workflow layer of the ObjectID framework. Implements creator/editor/approver/publisher roles, approval-flag gating, and DID-addressed document lineage for attaching product certifications, maintenance logs, and compliance records to on-chain ObjectIDs.',
  urls: [
    { label: 'Website', href: 'https://objectid.io' },
  ],
  teamId: 'objectid',
  match: { exact: ['oid_document'] },
  attribution: `
On-chain evidence: single-module Move package exporting only \`oid_document\`. The \`oid_\` prefix is ObjectID's canonical module-naming pattern; no other mainnet deployer ships an \`oid_*\` module. Three on-chain versions (all from ObjectID's primary deployer).

The \`oid_document\` module is registered as \`documentPackages\` in ObjectID's runtime config JSON (visible in every \`oid_identity\` entry-function call), confirming it's part of the ObjectID product.
`.trim(),
};
```

### Project file 3 — `projects/identity/objectid-gs1-hub.ts` (new)

```ts
import { ProjectDefinition } from '../project.interface';

export const objectidGs1Hub: ProjectDefinition = {
  name: 'ObjectID GS1 Hub',
  layer: 'L1',
  category: 'RWA / Product Authenticity',
  description: 'GS1 Integration Hub — ObjectID\'s interop bridge with GS1 standards (barcodes, GTINs, SSCCs, EPC, GS1 Digital Link). Maintains on-chain indexes (`by_gs1`, `by_alt`, `by_id`) mapping supply-chain identifiers to ObjectID digital twins so enterprises using GS1 catalogs can anchor their existing SKU namespace to the IOTA-based provenance layer.',
  urls: [
    { label: 'Website', href: 'https://objectid.io' },
  ],
  teamId: 'objectid',
  match: { exact: ['OIDGs1IHub'] },
  attribution: `
On-chain evidence: single-module Move package exporting only \`OIDGs1IHub\`. The module name is unique on mainnet — no other deployer ships it. Registered as \`OIDgs1Pagackage\` in ObjectID's runtime config JSON.
`.trim(),
};
```

### Project file 4 — `projects/identity/objectid-framework.ts` (new)

```ts
import { ProjectDefinition } from '../project.interface';

export const objectidFramework: ProjectDefinition = {
  name: 'ObjectID Framework',
  layer: 'L1',
  category: 'RWA / Product Authenticity',
  description: 'Support-layer packages of the ObjectID framework: shared utilities, framework-wide configuration (registered packages, JSON config), and a Move Kiosk allowlist transfer-policy rule for transfer-restricted ObjectID assets.',
  urls: [
    { label: 'Website', href: 'https://objectid.io' },
  ],
  teamId: 'objectid',
  match: {
    // Module names here (`utils`, `oid_config`, `allowlist_rule`)
    // are too generic to match by module signature alone — pin to
    // explicit addresses from the on-chain inventory.
    packageAddresses: [
      '0x2d12f6a540091c82063392611d7e1668925d618566ab4a7547662053e96cbeb0', // utils
      '0x6148d3674590634d59f8f972d71dd6148e014dd9c036c048d446853dd80049f4', // oid_config (v2)
      '0x47265daea4b23bba0968917d16aac0926baf8018cb9ffb4896a53e77bef2f9f8', // oid_config (v1)
      '0x229b368f5086b9030778f54dd123bb2e8debb8da559658f21f4a6fd11083e7d7', // allowlist_rule
    ],
  },
  attribution: `
On-chain evidence: four support-layer packages co-published by ObjectID's primary deployer (\`0x59dadd46…cc43\`) alongside the core identity, documents, and GS1 packages. Module names (\`utils\`, \`oid_config\`, \`allowlist_rule\`) are too generic to match by module signature; pinned to explicit package addresses from the on-chain inventory.

The \`utils\` package is registered as \`utilsPackages\` in ObjectID's runtime config JSON, and the two \`oid_config\` packages supply framework-wide configuration consumed by \`oid_identity\`.
`.trim(),
};
```

### Barrel `projects/identity/_index.ts` (replaces existing)

```ts
export { identityFull } from './identity-full';
export { identityWot } from './identity-wot';
export { objectid } from './objectid';
export { objectidDocuments } from './objectid-documents';
export { objectidGs1Hub } from './objectid-gs1-hub';
export { objectidFramework } from './objectid-framework';
export { credentials } from './credentials';
```

### `projects/index.ts` diff

```ts
// was:
//   import { identityFull, identityWot, oidIdentity, credentials } from './identity/_index';
import {
  identityFull,
  identityWot,
  objectid,
  objectidDocuments,
  objectidGs1Hub,
  objectidFramework,
  credentials,
} from './identity/_index';

// …

// Identity
// was: identityFull, identityWot, oidIdentity, credentials,
identityFull, identityWot,
objectid, objectidDocuments, objectidGs1Hub, objectidFramework,
credentials,
```

Priority ordering rationale: the three ObjectID sub-product rules
use `exact` / multi-module `all`, which cannot conflict with each
other or with neighboring defs (core requires all three `oid_*`
modules; Documents requires the single module set to be exactly
`{oid_document}`; GS1 Hub exactly `{OIDGs1IHub}`). `objectidFramework`
uses `packageAddresses` and therefore wins regardless of position,
but keep it last in the identity block for consistency with how
the rest of the registry orders catch-all defs.

## Alternative: umbrella approach

If we decide one row is preferable, drop the three sub-project
files and replace them with a single umbrella. This collapses all
12 packages into one ObjectID row:

```ts
import { ProjectDefinition } from '../project.interface';

export const objectid: ProjectDefinition = {
  name: 'ObjectID',
  layer: 'L1',
  category: 'RWA / Product Authenticity',
  description: '…same as split-approach core description…',
  urls: [
    { label: 'Website', href: 'https://objectid.io' },
    { label: 'IOTA Showcase', href: 'https://www.iota.org/learn/showcases/objectID' },
  ],
  teamId: 'objectid',
  match: {
    packageAddresses: [
      // Core identity (4)
      '0xc3aa78fa072860b344c671d2c904e036f376876e1e4dfc82c44c12086d4e3b81',
      '0xfb3afd146f1b7b203b90d64df5fecf28f71aa102cc89598dc0dff268e0c81a42',
      '0xd690e9a0ed0333632aa000ba7f65af065107414f9a04f1ca5ff909179655b200',
      '0xc6b77b8ab151fda5c98b544bda1f769e259146dc4388324e6737ecb9ab1a7465',
      // Documents (3)
      '0x6399e60508027bc419c5ba01d77859dfee4c266e93c0c70e48fe7079b1c76079',
      '0x23ba3cf060ea3fbb53542e1a3347ee1eb215913081fecdf1eda462c3101da556',
      '0xb218da213e22051cf02e7dbe90ce337284fb0fa13d7050b333100482f637783f',
      // Config (2)
      '0x6148d3674590634d59f8f972d71dd6148e014dd9c036c048d446853dd80049f4',
      '0x47265daea4b23bba0968917d16aac0926baf8018cb9ffb4896a53e77bef2f9f8',
      // Support (3)
      '0x229b368f5086b9030778f54dd123bb2e8debb8da559658f21f4a6fd11083e7d7', // allowlist_rule
      '0x2d12f6a540091c82063392611d7e1668925d618566ab4a7547662053e96cbeb0', // utils
      '0x949abb7b9e90778d62a70636736a69376284f31f0e40a3e5e7003a839d72be34', // OIDGs1IHub
    ],
  },
  attribution: `…same as split-approach core attribution…`.trim(),
};
```

Trade-off: the umbrella is simpler and hard-coded (no risk of
false-match) but hides the GS1-hub product surface, which is
arguably the most distinctive / press-worthy piece of ObjectID's
stack. Recommend the split.

## Registry-index changes (summary)

| File                                                        | Action                                |
|-------------------------------------------------------------|---------------------------------------|
| `api/src/ecosystem/teams/identity/oid.ts`                   | delete                                |
| `api/src/ecosystem/teams/identity/objectid.ts`              | create                                |
| `api/src/ecosystem/teams/identity/_index.ts`                | swap export                           |
| `api/src/ecosystem/teams/index.ts`                          | swap import + `ALL_TEAMS` entry       |
| `api/src/ecosystem/projects/identity/oid-identity.ts`       | delete                                |
| `api/src/ecosystem/projects/identity/objectid.ts`           | create                                |
| `api/src/ecosystem/projects/identity/objectid-documents.ts` | create (split)                        |
| `api/src/ecosystem/projects/identity/objectid-gs1-hub.ts`   | create (split)                        |
| `api/src/ecosystem/projects/identity/objectid-framework.ts` | create (split)                        |
| `api/src/ecosystem/projects/identity/_index.ts`             | add new exports, drop `oidIdentity`   |
| `api/src/ecosystem/projects/index.ts`                       | swap imports + `ALL_PROJECTS` entries |

No changes to matcher code in `ecosystem.service.ts` — the existing
`all` / `exact` / `packageAddresses` primitives cover every rule
we need.

## Coverage verification checklist (to run after applying)

- `npx tsc --noEmit` and `npx eslint src/` in `api/` — no errors.
- `npx jest src/ecosystem` — existing ecosystem tests still pass.
- Trigger a snapshot recapture; confirm:
  - The 4 core packages classify as `ObjectID`.
  - The 3 document packages classify as `ObjectID Documents`.
  - The 1 `OIDGs1IHub` package classifies as `ObjectID GS1 Hub`.
  - The 4 support packages classify as `ObjectID Framework`.
  - Total: 12 packages attributed to `teamId: 'objectid'`, zero
    `anomalousDeployers` on any of the four defs.
- On the website, `/project/objectid` (and the three sub-product
  pages) render with the logo, category, and URLs.
