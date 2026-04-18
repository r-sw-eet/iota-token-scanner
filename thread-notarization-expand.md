# IOTA Notarization — registry expansion draft

## Intro / problem statement

The Notarization deployer
(`0x56afb2eded3fb2cdb73f63f31d0d979c1527804144eb682c142eb93d43786c8f`)
ships **four** packages, but our registry currently only catches the
core notarization contract (`{all: ['dynamic_notarization']}` —
2 packages across 2 deployers).

Two of the three uncaptured packages are distinct IOTA Foundation
products, not upgrades of notarization:

1. **IOTA Identity Asset Framework** — a 16- and 17-module package pair
   implementing a multi-controller proposal workflow over on-chain
   "assets" (governance primitive: borrow / config / delete / transfer /
   upgrade proposals + a controller registry + migration tooling).
2. **IOTA Accreditation Registry** — a 7-module credential-issuer-style
   attestation registry (accreditation + property-shape vocabulary).

Both are invisible on the live `/ecosystem` page today. This thread
drafts the `ProjectDefinition` exports to fix that.

The third uncaptured package (the 17-module upgrade of the Asset
Framework, adding `access_sub_entity_proposal`) is auto-covered by the
same rule once we add it.

---

## Verified on-chain (2026-04-17 scan)

Queried `https://graphql.mainnet.iota.cafe` for all 747 mainnet
packages, filtered to the two Notarization deployers:

```
deployer=0x56af…6c8f
  pkg=0x84cf5d12de2f9731a89bb519bc0c982a941b319a33abefdd5ed2054ad931de08
  modules (16): [asset, borrow_proposal, config_proposal, controller,
                 controller_proposal, delete_proposal, identity, migration,
                 migration_registry, multicontroller, permissions, public_vc,
                 transfer_proposal, update_value_proposal, upgrade_proposal,
                 utils]

deployer=0x56af…6c8f
  pkg=0x36d0d56aea27a59f620ba32b6dd47a5e68d810714468bd270fda5ad37a478767
  modules (17): [access_sub_entity_proposal, asset, borrow_proposal,
                 config_proposal, controller, controller_proposal,
                 delete_proposal, identity, migration, migration_registry,
                 multicontroller, permissions, public_vc, transfer_proposal,
                 update_value_proposal, upgrade_proposal, utils]

deployer=0x56af…6c8f
  pkg=0x909ce9dcd9a5e97b7b8884fac8e018fad9dece348bf73837379b8694ff684cf3
  modules (5): [dynamic_notarization, locked_notarization, method,
                notarization, timelock]   # already captured

deployer=0x56af…6c8f
  pkg=0x0f75165f01198edbc758df00d61440a46300efb639f3a5c33a7c797a8a66d371
  modules (7): [accreditation, main, property, property_name,
                property_shape, property_value, utils]

deployer=0xedb0…5fc2
  pkg=0x9b248a2689be2ded8f01af21eb7eccec9812a649662577f610bb196ca2f9ddc5
  modules (5): [dynamic_notarization, locked_notarization, method,
                notarization, timelock]   # already captured
```

### Match-rule specificity (whole-mainnet scan)

| Rule                                                         | Match count | Notes                                                          |
|--------------------------------------------------------------|-------------|----------------------------------------------------------------|
| `{all: ['asset', 'multicontroller', 'controller_proposal']}` | 2           | Both are Asset Framework packages. Zero false-matches.         |
| `{all: ['accreditation', 'property', 'property_value']}`     | 1           | The single Accreditation Registry package. Zero false-matches. |

Additional sanity counts:

- `asset` module: 2 packages (both AF).
- `accreditation` module: 1 package (only this one).
- `multicontroller` module: 2 packages (both AF).
- `controller_proposal` module: 2 packages (both AF).
- `property` module: 1 package (only this one).
- `property_value` module: 1 package (only this one).

Every module token in both proposed rules is currently **unique to the
Notarization deployer's output**. The rules are as tight as a
deployer-level match on current mainnet; looser phrasings (e.g.
`{all: ['asset']}` alone) would still be safe today but the 3-module
conjunctions give us headroom against future IF co-locations.

---

## Proposed TypeScript code

### `api/src/ecosystem/projects/trade/asset-framework.ts` (new file)

```ts
import { ProjectDefinition } from '../project.interface';

export const assetFramework: ProjectDefinition = {
  name: 'IOTA Identity Asset Framework',
  layer: 'L1',
  category: 'Identity',
  description: 'Governance framework for on-chain assets on IOTA Rebased. Wraps Move objects as "assets" under a multi-controller registry where changes (borrow, transfer, config update, upgrade, delete) require on-chain proposals approved by the controller set. Built alongside the IOTA Identity stack.',
  urls: [],
  teamId: 'iota-foundation',
  match: { all: ['asset', 'multicontroller', 'controller_proposal'] },
  attribution: `
On-chain evidence: Move package with \`asset\`, \`multicontroller\`, and \`controller_proposal\` modules (plus a suite of per-action proposal modules: \`borrow_proposal\`, \`config_proposal\`, \`delete_proposal\`, \`transfer_proposal\`, \`update_value_proposal\`, \`upgrade_proposal\`, and in the 17-module upgrade, \`access_sub_entity_proposal\`).

Shipped by the same deployer as IOTA Notarization (\`0x56af…6c8f\`), which is the IOTA Foundation's canonical notarization-publishing key — see \`github.com/iotaledger/notarization\` and \`iota.org/products/notarization\`. The Asset Framework is co-deployed with Notarization because notarized records are treated as identity-assetized Move objects; the governance primitives here (multi-controller, proposal workflow) are how mutations on those assets get authorized. "IOTA Identity Asset Framework" is our descriptive name — IF hasn't (yet) branded this as a standalone product the way Notarization is branded. Attributed to the consolidated \`iota-foundation\` team.
`.trim(),
};
```

### `api/src/ecosystem/projects/trade/accreditation-registry.ts` (new file)

```ts
import { ProjectDefinition } from '../project.interface';

export const accreditationRegistry: ProjectDefinition = {
  name: 'IOTA Accreditation Registry',
  layer: 'L1',
  category: 'Identity',
  description: 'Credential-issuer accreditation registry on IOTA Rebased. Records which issuers are accredited to attest which property shapes (schemas), plus the typed property values those accreditations cover. Operates alongside IOTA Notarization and the Identity Asset Framework as the trust-anchor layer for verifiable credentials.',
  urls: [],
  teamId: 'iota-foundation',
  match: { all: ['accreditation', 'property', 'property_value'] },
  attribution: `
On-chain evidence: Move package with \`accreditation\`, \`property\`, \`property_name\`, \`property_shape\`, \`property_value\`, \`main\`, and \`utils\` modules. The \`accreditation\` + \`property_shape\` + \`property_value\` tri-set is the giveaway: this is a schema-aware on-chain registry for issuer accreditations, not a generic attestation contract.

Shipped by the Notarization deployer (\`0x56af…6c8f\`, IOTA Foundation). Logically paired with the Identity Asset Framework + Notarization: accreditations here declare which issuers may attest which property shapes, and those attestations then get notarized or issued as credentials via the broader IF identity stack. "IOTA Accreditation Registry" is our descriptive name; IF has not (yet) published a standalone product page for it. Attributed to the consolidated \`iota-foundation\` team.
`.trim(),
};
```

### `api/src/ecosystem/projects/trade/_index.ts` (patch)

```ts
export { tlip } from './tlip';
export { notarization } from './notarization';
export { assetFramework } from './asset-framework';              // NEW
export { accreditationRegistry } from './accreditation-registry';// NEW
export { traceability } from './traceability';
export { salus } from './salus';
```

### `api/src/ecosystem/projects/index.ts` (patch)

Two small diffs — the trade-import barrel gains two symbols, and the
`ALL_PROJECTS` array places them **immediately after `notarization`**
(see insertion-order rationale below):

```ts
import { tlip, notarization, assetFramework, accreditationRegistry, traceability, salus } from './trade/_index';

// ...

export const ALL_PROJECTS: ProjectDefinition[] = [
  // DeFi
  poolsFinance, poolsFarming,
  virtue, virtueStability, virtuePool,
  swirl, swirlValidator,

  // Trade / Enterprise
  tlip,
  notarization,
  assetFramework,          // NEW — placed here, see insertion-order note
  accreditationRegistry,   // NEW
  traceability,
  salus,

  // Identity (identityFull before identityWot — more specific)
  identityFull, identityWot, oidIdentity, credentials,

  // …rest unchanged…
];
```

---

## Attribution prose (summary — full text embedded in the `attribution`
fields above)

**IOTA Identity Asset Framework**

- Shipped by the Notarization deployer
  `0x56afb2eded3fb2cdb73f63f31d0d979c1527804144eb682c142eb93d43786c8f`.
  That deployer's IF attribution is already gold-standard via
  `github.com/iotaledger/notarization` (the `iotaledger` org is IOTA
  Foundation's canonical GitHub organization).
- Module signature (`asset` + `multicontroller` +
  `{borrow,config,delete,transfer,update_value,upgrade}_proposal`) is
  a textbook governance-over-objects pattern; paired with `identity`,
  `permissions`, `public_vc`, and `migration_registry` it reads as the
  object-governance substrate under IF's broader identity product
  line.
- Name is descriptive — IF hasn't branded this as a distinct product
  yet, so "IOTA Identity Asset Framework" is ours. Keep the "IOTA"
  prefix to make the IF origin legible in listing tables.

**IOTA Accreditation Registry**

- Same deployer, same gold-standard deployer→IF chain.
- Module signature (`accreditation` + `property_shape` + `property_value`
  + `property_name`) is a credential-issuer accreditation registry:
  encodes which issuers can attest which schema types. Natural
  companion to Notarization (which anchors records) and the Asset
  Framework (which governs object mutation).
- Name is again descriptive, prefixed "IOTA" for the same reason.

Both attributions are conclusive on the strength of the deployer→IF
proof carried over from Notarization. No extra external attestation is
needed beyond what already underwrites the consolidated
`iota-foundation` team.

---

## Insertion order in `ALL_PROJECTS`

Match priority runs **top-to-bottom** in `ALL_PROJECTS`: the first rule
that matches a package wins. Both proposed rules are fully disjoint
from every existing rule (the scan above showed zero overlaps), so
placement is a stylistic / readability decision rather than a
correctness one.

Recommended placement: **immediately after `notarization`**, before
`traceability`. Rationale:

1. Same deployer, same team, same IF product cluster. Co-locating the
   three rows (`notarization`, `assetFramework`, `accreditationRegistry`)
   keeps the file self-documenting.
2. No risk of the Asset Framework rule shadowing `notarization`
   (disjoint module sets) nor vice versa.
3. Keeps the already-established "more specific before less specific"
   invariant trivially satisfied — the two new rules are 3-module
   conjunctions on modules that appear in exactly 1-2 mainnet packages,
   which is about as specific as `dynamic_notarization` already is.

No changes needed to earlier or later entries.

---

## Concerns / risks

### False-match risk — **low**

All six module tokens used by the two rules are currently unique on
mainnet to these three packages. Future risk scenarios:

- A non-IF third-party ships a package with `asset` + `multicontroller`
  + `controller_proposal` — would be mis-attributed to IOTA Foundation.
  Mitigation: these are verbose, IF-pattern-specific module names; the
  multicontroller+proposal combination is unusual enough that a
  coincidental collision is unlikely. We'd catch it at the next
  recapture's "anomalous deployer" log.
- A non-IF third-party ships `accreditation` + `property` +
  `property_value` — similar risk, similarly unlikely. Same
  anomalous-deployer guardrail applies.

If we want extra insurance: tighten the Asset Framework rule to
`{all: ['asset', 'multicontroller', 'controller_proposal', 'borrow_proposal', 'upgrade_proposal']}`
(still matches both AF packages, still zero false-matches today).
Not recommended initially — the 3-module form is already tight enough
and keeps the match rule readable.

### Naming collisions — **none**

No other project in `ALL_PROJECTS` uses "Asset Framework",
"Accreditation", or "Accreditation Registry" in its name. The "IOTA "
prefix mirrors the existing "IOTA Flip" / "OID Identity" / "IOTA
Notarization"-flavored nomenclature and makes IF origin legible.

### Category choice

Set both to `Identity` (matches existing categorical vocabulary —
see the current `Identity` / `Notarization` / `Supply Chain` tokens in
`ALL_PROJECTS`). Thread notes suggested `Identity / Asset Framework`
and `Identity / Accreditation`, but none of our existing categories
use slash-compound forms — a pass to introduce that convention should
be its own change. Using plain `Identity` today keeps the UI
consistent; the richer product positioning lives in the `name` +
`description` + `attribution` fields already.

### `attribution` length

Both prose blocks are over 400 characters (consistent with the other
IF product defs — e.g. `identityFull`, `credentials`) and under the
informal 500-char cap that `description` has. The `description`
field in both proposed defs is between 280-360 chars, comfortably
within the interface's 50–500 window.

### TODO / follow-ups

When shipping, add a TODO.md entry under "Registry-expansion" or
retire the matching bullet in `threads.md` ("IOTA Notarization —
missing IOTA Identity Asset Framework + Accreditation Registry"). The
handoff's "Registry adequacy" paragraph on Notarization should then
read "all 5 of 5 packages captured".

Also: once these land, a manual recapture (same pattern as the
previous consolidation deploy — see `handoff.md` session notes) is
needed for the live `/ecosystem/teams/iota-foundation` endpoint to
expose 9 projects (the current 7 + these 2).
