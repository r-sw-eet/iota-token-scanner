# TWIN (verifiable_storage) — new registry entry

## Goal

Register the mainnet footprint of **TWIN** (Trade Worldwide
Information Network) — the IOTA Foundation's Swiss-based trade-
digitization foundation — as a standalone team + project.

TWIN is the broader initiative that sits above TLIP:

- **TLIP** (already in the registry, package `0xdeadee97…e108`) is
  TWIN's Kenya customs deployment — it ships the business-logic
  primitives (`ebl`, `carrier_registry`, `endorsement`,
  `interop_control`, `notarization`).
- **TWIN** ships a *generic* verifiable-storage anchor
  (`verifiable_storage::store_data`) that TWIN apps call to notarize
  W3C Verifiable Credentials of type `ImmutableProof`.

This thread documents the discovery and the registry change.

---

## Trigger

`https://manifesto.iota.org/` (IOTA's 2026 manifesto) contains a
single, explicitly-linked mainnet explorer URL in the TWIN section,
right after the sentence *"Since early January 2026, TWIN is now
fully integrated with the IOTA mainnet. […] The first transactions
are already live."*:

```
https://explorer.iota.org/txblock/GJ6arrpFMqA3Noh7AkgRmA3czQnTbjA2aiL2nT1GMhEc?network=mainnet
```

The digest is unique in the manifesto HTML (verified by fetching
`/tmp/manifesto.html` and grepping). IOTA Foundation is pointing
at this tx as TWIN's mainnet debut.

---

## On-chain resolution

### 1. The manifesto-cited tx

`iota_getTransactionBlock(GJ6arr…MhEc)` via
`api.mainnet.iota.cafe`:

- **MoveCall target**:
  `0xf9510519dfc1cf035a0ee8a2f9bdb770d9eba3f49fb519cf406214d27372cc13::verifiable_storage::store_data`
- **Sender**:
  `0xfbf87d8a5b8d29ebce06148e601a2ca381977c1630d57ef0155a0b17868b2d2d`
- **Gas sponsor**:
  `0x5b45067591bd332447ec0ff190594060bf461c5619cf3ed933bd13b91d2b6bf3`
  (sponsored-tx pattern — consistent with the manifesto's "IOTA
  Gas Station enables non-crypto-native users" positioning)
- **Event**: `…::verifiable_storage::StorageCreated` with a new
  object id `0x9508…8f9f`
- **Timestamp**: `2026-01-16T09:11:08.118Z` (matches manifesto's
  "Since early January 2026")
- **Payload** (base64-decoded): a W3C VC of type
  `ImmutableProof`, `@context` includes
  `https://schema.twindev.org/immutable-proof/` and
  `https://schema.twindev.org/common/`, verified by
  `did:iota:0xc5c970c0d5ca7653c9e281dccade07ce739d15a525efc3c29c1bd1987b19e0d7#immutable-proof-assertion`

The `schema.twindev.org` + `did:iota:…#immutable-proof-assertion`
combination pins the issuer to TWIN unambiguously.

### 2. Deployer & full footprint

GraphQL (`graphql.mainnet.iota.cafe`) resolves the package's
`previousTransactionBlock.sender` to:

- **Deployer**:
  `0x164625aaa09a1504cd37ba25ab98525cf2e15792f06a12dd378a044a0d719abe`

Whole-mainnet scan (747 packages, 15 pages × 50) filtered for
module name `verifiable_storage`:

| Package                                                              | Deployer           |
|----------------------------------------------------------------------|--------------------|
| `0x90cb202216d3000f75b1ec990740ee5969ee8e03adf54c0a0fe3df6ac8f60155` | `0x164625aa…19abe` |
| `0x9c3dd66dcd05d86ac1b9485fdcc912dd3ef63447c86ad7af94709b77ba552909` | `0x164625aa…19abe` |
| `0xf9510519dfc1cf035a0ee8a2f9bdb770d9eba3f49fb519cf406214d27372cc13` | `0x164625aa…19abe` |
| `0x5a308b6bbb600f9fc9ae507ecf06e40a62758699a87cf73224e0508b7041ed44` | `0x164625aa…19abe` |
| `0xb9f1d3ccefa2fd29ec979d63db31dc81beecab60857a338c2c0e1d2bbdf44df0` | `0x164625aa…19abe` |
| `0xefffb30fb0af9c2b31fcb64d24693f68354e1ec045b2814554f2c620bb93d231` | `0x164625aa…19abe` |

**6 of 6** come from the same deployer. This is a clean upgrade
line of a single package, not a family of related products.

Each package exposes exactly one module, `verifiable_storage`. No
other modules are co-located.

---

## Match-rule specificity

Scanned the full 747-package mainnet corpus for module name
`verifiable_storage`: **6 matches, all six from the TWIN
deployer above.** Zero false-matches.

`{all: ['verifiable_storage']}` is as tight as a deployer-list
today and reads self-documentingly.

## Negative findings — other TWIN modules are *not* on mainnet yet

`https://twindev.org/` documents a broader set of TWIN product
areas. I scanned mainnet for each one:

| Module name             | On mainnet?                  |
|-------------------------|------------------------------|
| `verifiable_storage`    | [x] 6 packages (this thread) |
| `immutable_proof`       | [ ] 0 packages               |
| `auditable_item_graph`  | [ ] 0 packages               |
| `auditable_item_stream` | [ ] 0 packages               |
| `attestation`           | [ ] 0 packages               |
| `tokenization`          | [ ] 0 packages               |
| `hierarchies`           | [ ] 0 packages               |

These names appear on `twindev.org` as documentation categories,
but they're implemented in TWIN's TypeScript SDK / JSON-schema
vocabulary, not yet as Move modules. As more of the TWIN stack
lands on-chain, the match rule may need to broaden — worth
revisiting when TWIN's next mainnet push is announced.

`notarization` (as a Move module name) exists on mainnet but
belongs to two other products: IOTA Notarization
(`iota-foundation` team, deployer `0x56af…6c8f`) and TLIP
(`if-tlip`, deployer `0xd7e2de…5176`). Not a TWIN signal on its
own.

`gas_station` (as a Move module name) exists on mainnet but
belongs to `studio-b8b1` (see `handoff.md` → Studio 0xb8b1380e),
not to TWIN's IOTA-Gas-Station product. The manifesto's "IOTA
Gas Station" appears to be a service/relayer pattern rather
than a named on-chain module — the sponsored-tx plumbing shows
up in the tx envelope (`gasData.owner` differs from
`transaction.sender`), not in module names.

---

## Attribution strength

**Gold-standard, organizational grade.** The chain of evidence:

1. IOTA Foundation manifesto publicly names tx `GJ6arr…MhEc` as
   TWIN's first mainnet tx.
2. That tx's MoveCall target is the `verifiable_storage` package
   at `0xf951…cc13`.
3. The VC payload references `schema.twindev.org/immutable-proof/`
   — twindev.org is TWIN Foundation's official dev-docs domain
   (confirmed via twinfoundation GitHub org's public README which
   points to twindev.org and schema.twindev.org).
4. All 6 `verifiable_storage` packages on mainnet come from the
   same deployer `0x164625aa…19abe`, forming a clean upgrade line.

Gap (not blocking): no public document lists the deployer address
`0x164625aa…19abe` or the package address `0xf951…cc13`
specifically. Same gap as TLIP — the manifesto points at *a tx*,
not at *an address*. This is TWIN's publication practice, not
ours. Since the manifesto explicitly flags the tx as TWIN's
mainnet debut, that's stronger than the typical deployer-match
rule for other projects in the registry.

---

## Registry changes

### `api/src/ecosystem/teams/trade/twin-foundation.ts` (new)

```ts
import { Team } from '../team.interface';

export const twinFoundation: Team = {
  id: 'twin-foundation',
  name: 'TWIN Foundation',
  description: 'TWIN (Trade Worldwide Information Network) — Swiss non-profit foundation for digital trade infrastructure, built on IOTA.',
  urls: [
    { label: 'TWIN', href: 'https://www.twin.org' },
    { label: 'Dev docs', href: 'https://twindev.org' },
    { label: 'GitHub', href: 'https://github.com/twinfoundation' },
  ],
  deployers: ['0x164625aaa09a1504cd37ba25ab98525cf2e15792f06a12dd378a044a0d719abe'],
  attribution: `
Deployer \`0x164625aa…19abe\` publishes the \`verifiable_storage\` package line that TWIN apps use to anchor W3C Verifiable Credentials of type ImmutableProof. Attribution anchors on https://manifesto.iota.org/, which explicitly links to mainnet tx \`GJ6arr…MhEc\` as TWIN's "first mainnet transactions" — that tx is a MoveCall into this deployer's package \`0xf951…cc13\`, and the VC payload references \`schema.twindev.org/immutable-proof/\` (TWIN's official schema domain). Kept separate from \`if-tlip\` because TWIN Foundation is the parent org and TLIP is one of its country deployments; keeping them distinct makes the TLIP-customs vs. TWIN-generic-anchor split legible in the listing.
`.trim(),
};
```

### `api/src/ecosystem/projects/trade/twin-immutable-proof.ts` (new)

```ts
import { ProjectDefinition } from '../project.interface';

export const twinImmutableProof: ProjectDefinition = {
  name: 'TWIN ImmutableProof',
  layer: 'L1',
  category: 'Trade Finance',
  description: 'TWIN Foundation\'s generic anchoring layer on IOTA mainnet. Each call to `verifiable_storage::store_data` writes a W3C Verifiable Credential of type ImmutableProof into a Move object, giving TWIN-powered trade apps a tamper-evident on-chain timestamp plus DID-signed author attribution for any off-chain document or changeset.',
  urls: [
    { label: 'TWIN', href: 'https://www.twin.org' },
    { label: 'Schema', href: 'https://schema.twindev.org/immutable-proof/' },
  ],
  teamId: 'twin-foundation',
  match: { all: ['verifiable_storage'] },
  attribution: `
On-chain evidence: Move package with a single module \`verifiable_storage\` (function \`store_data\`, event \`StorageCreated\`). Across 747 mainnet packages scanned 2026-04-18, all 6 packages exposing this module belong to the TWIN deployer \`0x164625aa…19abe\` — zero false-matches. The 1-module match is safe because \`verifiable_storage\` is a distinctive name unique to TWIN on mainnet today.

Project name uses TWIN's user-facing vocabulary (W3C VC \`type: ImmutableProof\`, per the VC payload format at \`schema.twindev.org/immutable-proof/\`) rather than the internal Move module name. Distinct from TLIP (which ships eBL + carrier_registry + endorsement business-logic primitives at \`0xdeadee97…e108\`): TLIP is a TWIN customer deployment in Kenya, while this package is the generic anchor TWIN itself exposes to all its apps.
`.trim(),
};
```

### `api/src/ecosystem/teams/trade/_index.ts` (patch)

```ts
export { ifTlip } from './if-tlip';
export { twinFoundation } from './twin-foundation';  // NEW
export { salus } from './salus';
```

### `api/src/ecosystem/teams/index.ts` (patch)

```ts
import { ifTlip, twinFoundation, salus } from './trade/_index';
// …
// Trade
ifTlip, twinFoundation, salus,
```

### `api/src/ecosystem/projects/trade/_index.ts` (patch)

```ts
export { tlip } from './tlip';
export { twinImmutableProof } from './twin-immutable-proof';  // NEW
export { notarization } from './notarization';
export { traceability } from './traceability';
export { salus } from './salus';
```

### `api/src/ecosystem/projects/index.ts` (patch)

```ts
import { tlip, twinImmutableProof, notarization, traceability, salus } from './trade/_index';
// …
// Trade / Enterprise
tlip, twinImmutableProof, notarization, traceability, salus,
```

### Insertion-order rationale

`ALL_PROJECTS` order is priority order (first matching rule wins).
The new rule `{all: ['verifiable_storage']}` is disjoint from
every existing rule (confirmed by the whole-mainnet scan), so
placement is stylistic. Placing it immediately after `tlip` keeps
the two TWIN-ecosystem rows co-located and matches the
conceptual relationship (TLIP uses TWIN's anchor layer).

`ALL_TEAMS` order doesn't affect matching — teams are looked up
by id. Grouped next to `ifTlip` for the same readability reason.

---

## Concerns / risks

### False-match risk — very low

`verifiable_storage` is a long, compound, domain-specific name.
The 6 mainnet matches are a clean monoculture (single deployer,
single module per package). Future risk:

- A third-party ships `verifiable_storage` as their own module
  name → would mis-attribute to TWIN. Unlikely: the name is
  distinctive enough that a coincidence is implausible, and our
  next recapture would flag the anomalous deployer.

Not tightening the rule further (e.g. to
`{packageAddresses: [...6 addresses]}`) because the module match
auto-discovers future TWIN upgrades without needing a code
change.

### Naming collisions — none

No existing project uses "TWIN", "ImmutableProof", or
"Verifiable Storage" in its name.

### Logo

No TWIN logo in the repo. Leaving `logo` unset; initials fallback
("TW") will render via `ProjectLogo.vue`. Can drop a
`/logos/twin.svg` in later.

### TODO on shipping

- Run `npx tsc --noEmit && npx eslint src/` in `api/` (per
  CLAUDE.md's `make ready` guidance).
- Run `npx jest` — no existing spec enumerates `ALL_PROJECTS`
  length or specific names (confirmed via grep of
  `ecosystem.service.spec.ts`), so no snapshot updates expected.
- After deploy, recapture so the live
  `/ecosystem/teams/twin-foundation` endpoint materializes.

---

## Files to touch when shipping

- `thread-twin-verifiable-storage.md` (this file) — created.
- `api/src/ecosystem/teams/trade/twin-foundation.ts` — created.
- `api/src/ecosystem/projects/trade/twin-immutable-proof.ts` — created.
- `api/src/ecosystem/teams/trade/_index.ts` — 1-line add.
- `api/src/ecosystem/teams/index.ts` — 2-line edit (import + array).
- `api/src/ecosystem/projects/trade/_index.ts` — 1-line add.
- `api/src/ecosystem/projects/index.ts` — 2-line edit (import + array).
- `threads.md` / `handoff.md` — add retirement / recap entry (optional, per project doc hygiene).

## Follow-ups

- Watch `twindev.org` and the TWIN GitHub org for the other
  documented modules (`immutable_proof`, `auditable_item_graph`,
  `auditable_item_stream`, `attestation`, `tokenization`,
  `hierarchies`) to land on-chain. Each is a candidate sub-
  project under the same team.
- Consider a `disclaimer` field on `twinImmutableProof` clarifying
  that calls from sponsored-tx patterns (gas owner ≠ sender) are
  how non-crypto-native trade customers interact with the
  package — relevant for interpreting sender counts.
