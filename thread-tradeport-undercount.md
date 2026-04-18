# Tradeport undercount — registry expansion draft

## Goal

Close the Tradeport attribution gap. Current rules catch 8 of 15
packages across Tradeport's two deployers; 7 are unattributed. Draft
registry additions that route the remaining packages to the
`tradeport` team without introducing false positives.

Scope: draft only. No files under `api/src/` are edited here.

## On-chain inventory (2026-04-17 mainnet GraphQL)

Both deployers re-scanned via
`address(address: …).transactionBlocks.effects.objectChanges`.

### Deployer A — `0x20d666d8e759b3c0c3a094c2bac81794e437775c7e4d3d6fe33761ae063385f7` (12 packages)

| #   | Package                                                              | Modules                                        | Current match |
|-----|----------------------------------------------------------------------|------------------------------------------------|---------------|
| 1   | `0x7e3a746db5dc3fc7a3fca6ad662ceeb006a22b79308388f0affb8739da3804b2` | `tradeport_biddings`                           | Tradeport     |
| 2   | `0x9ef08aa238127e7ed0bf0591b4f2cdc7747b347e88a8ffb9ad429db02fd72d95` | `tradeport_biddings`                           | Tradeport     |
| 3   | `0xe6c41569ca8bed156b9e90c34eab3f2575c92755cafd0ce0fbfa475ad9ba29ed` | `tradeport_biddings`                           | Tradeport     |
| 4   | `0xe70ff9774912470b21b29c781ff2821902866f931953e48740ef5d9660f83d25` | `launchpad, mint_box, pseudorandom, signature` | NFT Launchpad |
| 5   | `0x17acf6679fed499bb60f0c6dc4fffc98d20e2651415cd6630013a1bd9ed4dc9e` | `launchpad, mint_box, pseudorandom, signature` | NFT Launchpad |
| 6   | `0xdfb5203d17b573dd43baa9b4c5ddfd93e6880c57246a21d25768ecdac30e7d04` | `launchpad, mint_box, pseudorandom, signature` | NFT Launchpad |
| 7   | `0x6a0631c06a5b84faf80575023f63d697b9af8c5ed91a255b5299a285196fc35f` | `kiosk_listings`                               | **unmatched** |
| 8   | `0x0c9c0e5be77d5a71e55fa5a6c0c451d287ceceda0e9871ae0d2472f9ad8db13d` | `kiosk_listings`                               | **unmatched** |
| 9   | `0xefc4b12e045e82af5ad23ceca2efb88a0a4cc1edf28a4aff0ec2bc843363dc6c` | `kiosk_transfers`                              | **unmatched** |
| 10  | `0x6d2d0cf7a48618221876268c8205395bc389920f168c1146e18c99e11cf16049` | `kiosk_transfers`                              | **unmatched** |
| 11  | `0xb28249cabb6ff096c366a6bb726617ef34a32f3f752b3620938cb4c8287859d7` | `listings`                                     | **unmatched** |
| 12  | `0xc03304c6c159e328c7f48f6be03575be5270af06ce1e227b86337e81496763db` | `listings`                                     | **unmatched** |

### Deployer B — `0xae24ce73cd653c8199bc24afddc0c4ddbf0e9901d504c3b41066a6a396e8bf1e` (3 packages)

| #   | Package                                                              | Modules                                                                                              | Current match |
|-----|----------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|---------------|
| 13  | `0x20e93aada1e07c8a908adf668ecc0226c0d7499ff817e90d257fc30fc09c6ff5` | `launchpad, mint_box, pseudorandom, signature`                                                       | NFT Launchpad |
| 14  | `0x78eedfea7dca570872c7c2197620c87e6e88a537f045849da796fc92240d5cc9` | `floor_price_rule, kiosk_lock_rule, personal_kiosk, personal_kiosk_rule, royalty_rule, witness_rule` | **unmatched** |
| 15  | `0x8c3edf53026c9fe1fec757d42d5e5b81017a7cb508bdd08b8c9332b7546ecffd` | `nft_type`                                                                                           | **unmatched** |

Captured 8/15 (ticks match the uncaptured-7 count in `threads.md` /
`handoff.md`). Handoff's "transfer-policy rules captured where?"
parenthetical was misremembered — the 6-module rules package is in
fact one of the 7 uncaptured.

## False-match risk audit (full-mainnet scan)

Scanned all 747 mainnet packages (page-drained at 50/page). For each
candidate module used in the draft rules below, counted how many
non-Tradeport packages contain it:

| Module               | Tradeport pkgs | Non-Tradeport pkgs |
|----------------------|----------------|--------------------|
| `tradeport_biddings` | 3              | 0                  |
| `launchpad`          | 4              | 0                  |
| `mint_box`           | 4              | 0                  |
| `kiosk_listings`     | 2              | 0                  |
| `kiosk_transfers`    | 2              | 0                  |
| `listings`           | 2              | 0                  |
| `nft_type`           | 1              | 0                  |
| `floor_price_rule`   | 1              | **1**              |

The single non-Tradeport hit:

- `0xe49f2f23baf6c88a4c18478ac375033eea1f5609f2be6359b417208ea96f555d`
  from deployer `0x4ecf96a1cc095f0feac25b5a8e09aaa79dcc9e5728668f14ea5068bd6fe6dfbd`
- Module set: `{floor_price_rule, kiosk_lock_rule, personal_kiosk,
  personal_kiosk_rule, royalty_rule, witness_rule}` —
  **byte-for-byte the same 6-module set** as Tradeport's package 14.
- Plausibly a re-publish of the upstream IOTA Move
  `transfer_policy_rules` example. We cannot attribute it to
  Tradeport (unknown deployer), but a naive module-match rule would
  false-match it.

Conclusion: every candidate module except the transfer-policy-rules
set is Tradeport-unique on mainnet *today*. The rules set is an
upstream-library module group and is inherently ambiguous by
signature alone.

## Recommendation

Use **`packageAddresses` for the transfer-policy-rules package**
(only safe way given the `0x4ecf…` collision) and **narrow module
matchers** for the kiosk / listings variants (no current collisions,
and the matchers double as future-proofing for new upgrade versions
from the same deployers). Skip `nft_type` as a standalone product —
it's a single shared type package with no app surface of its own;
leave it for a future "deployer-match" rule type if we want
completeness.

Concretely, add three new project defs:

1. **Tradeport Kiosk** — matches both `kiosk_listings` and
   `kiosk_transfers` packages via `any:`. These 4 packages are the
   Kiosk-native leg of the marketplace (list via Kiosk, transfer via
   Kiosk). Grouping into one product keeps the site's project count
   from exploding; they're two halves of the same feature.

2. **Tradeport Listings** — matches the standalone `listings` module
   via `exact: ['listings']`. The `exact` form only fires on a
   single-module package, which already excludes all 746 other
   mainnet packages (none of them have exactly `{listings}`).

3. **Tradeport Transfer Policies** — matches by **`packageAddresses`
   only** (the two known package addresses, one per version if a
   future upgrade appears). No module matcher, because the 6-module
   set collides with the `0x4ecf…` rule mirror. Today that's just
   one address; add the second slot as a placeholder for when the
   team upgrades.

`nft_type`: **skip** in this pass. It's a single-module shared type
package, no events, minimal storage rebate. Claiming it would need
either a third `packageAddresses` entry (acceptable but
low-information) or a deployer-match rule. Add to `TODO.md` under
"Ecosystem project-def audit" instead. (Not performed in this draft
— noted here as follow-up.)

### Why not a deployer-match rule type?

`handoff.md` option 2 (introduce a `deployerAddresses` matcher) is
cleaner long-term and would sweep up `nft_type` too. But:

- It's a scanner-core change (`api/src/ecosystem/ecosystem.service.ts
  matchProject`), not just a registry addition — bigger blast
  radius.
- Current codebase already has precedent for `packageAddresses` +
  module matchers co-existing; three targeted defs fit that style.
- The kiosk / listings / rules packages are distinct *products*
  worth surfacing as separate rows rather than folding silently into
  "Tradeport". Product granularity is consistent with how
  TokenLabs/ObjectID expansions are being planned in `threads.md`.

Recommend: ship the three defs below now; add the deployer-match
rule-type separately if we need to catch stragglers like `nft_type`.

### Priority ordering in `ALL_PROJECTS`

The existing `nftLaunchpad` must stay above `tradeport` and the new
defs (its `{launchpad, mint_box}` is more specific). The new defs
below don't overlap each other or with existing ones, but place them
adjacent to `tradeport` in the NFT block for readability:

```
// NFT (more specific first)
nftLaunchpad,
tradeportKiosk,          // NEW — kiosk_listings/kiosk_transfers
tradeportListings,       // NEW — exact:['listings']
tradeportTransferPolicies, // NEW — packageAddresses
tradeport,
nftCollections,
```

## Draft project definitions

Three new files under `api/src/ecosystem/projects/nft/`, plus
updates to `_index.ts` and `projects/index.ts`.

### `api/src/ecosystem/projects/nft/tradeport-kiosk.ts`

```ts
import { ProjectDefinition } from '../project.interface';

export const tradeportKiosk: ProjectDefinition = {
  name: 'Tradeport Kiosk',
  layer: 'L1',
  category: 'NFT Marketplace',
  description: 'Kiosk-native listing and transfer primitives for the Tradeport NFT marketplace. Implements IOTA Kiosk-standard listings and ownership transfers for trades that route through user-owned kiosks rather than the central bidding contract.',
  urls: [
    { label: 'Website', href: 'https://tradeport.xyz' },
  ],
  teamId: 'tradeport',
  match: { any: ['kiosk_listings', 'kiosk_transfers'] },
  attribution: `
On-chain evidence: Move package containing either a \`kiosk_listings\` or \`kiosk_transfers\` module, deployed by Tradeport's known marketplace deployer.

A mainnet scan across all 747 packages shows these two module names appear exclusively at the Tradeport deployer \`0x20d666…85f7\` (four packages: two versions of each module). No other deployer ships either module. The naming mirrors Aptos Tradeport's V2 marketplace architecture (\`listings_v2\` + kiosk adapters); on IOTA Move the equivalent primitive is the native Kiosk, so the team named its modules \`kiosk_listings\` and \`kiosk_transfers\` to match.
`.trim(),
};
```

### `api/src/ecosystem/projects/nft/tradeport-listings.ts`

```ts
import { ProjectDefinition } from '../project.interface';

export const tradeportListings: ProjectDefinition = {
  name: 'Tradeport Listings',
  layer: 'L1',
  category: 'NFT Marketplace',
  description: 'Standalone listings primitive for the Tradeport NFT marketplace. Holds fixed-price listings and handles direct buy flows outside the kiosk path.',
  urls: [
    { label: 'Website', href: 'https://tradeport.xyz' },
  ],
  teamId: 'tradeport',
  match: { exact: ['listings'] },
  attribution: `
On-chain evidence: Move package whose module set is exactly \`{listings}\` (a single module named \`listings\`, nothing else).

A mainnet scan confirms only two packages in the network satisfy this signature, both deployed by Tradeport's deployer \`0x20d666…85f7\`. The name \`listings\` mirrors Aptos Tradeport V1's \`listings\` module — the same team's cross-chain naming convention. Using \`exact\` (rather than \`all\`) guards against future false matches: any other project shipping \`listings\` together with additional modules would fall through this rule.
`.trim(),
};
```

### `api/src/ecosystem/projects/nft/tradeport-transfer-policies.ts`

```ts
import { ProjectDefinition } from '../project.interface';

export const tradeportTransferPolicies: ProjectDefinition = {
  name: 'Tradeport Transfer Policies',
  layer: 'L1',
  category: 'NFT Marketplace',
  description: 'Transfer-policy rule modules (royalty enforcement, floor price, personal kiosk lock, witness-based auth) that Tradeport wires into its Kiosk listings to enforce marketplace fees and per-collection policies.',
  urls: [
    { label: 'Website', href: 'https://tradeport.xyz' },
  ],
  teamId: 'tradeport',
  match: {
    // Pinned by exact package address: the 6-module rule set
    // (floor_price_rule, kiosk_lock_rule, personal_kiosk,
    // personal_kiosk_rule, royalty_rule, witness_rule) is also
    // published by an unrelated deployer (0x4ecf96…) — likely a
    // copy of the upstream IOTA Move transfer_policy_rules example.
    // Matching by modules would false-attribute that package.
    packageAddresses: [
      '0x78eedfea7dca570872c7c2197620c87e6e88a537f045849da796fc92240d5cc9',
    ],
  },
  attribution: `
On-chain evidence: specific Move package published from Tradeport's deployer \`0xae24ce…bf1e\` containing six modules: \`floor_price_rule\`, \`kiosk_lock_rule\`, \`personal_kiosk\`, \`personal_kiosk_rule\`, \`royalty_rule\`, \`witness_rule\`. These are standard IOTA Kiosk transfer-policy rules used by Tradeport to enforce marketplace fees, royalty payouts, and personal-kiosk locks on listed NFTs.

Matched by exact package address rather than module signature: the same 6-module set is published by a second unrelated mainnet deployer (\`0x4ecf96…\`, one-off package), most likely a republish of the upstream IOTA Move \`transfer_policy_rules\` example. A module-based rule would false-attribute it to Tradeport; the address-pin avoids that.
`.trim(),
};
```

### `api/src/ecosystem/projects/nft/_index.ts` (update)

```ts
export { nftLaunchpad } from './nft-launchpad';
export { tradeportKiosk } from './tradeport-kiosk';
export { tradeportListings } from './tradeport-listings';
export { tradeportTransferPolicies } from './tradeport-transfer-policies';
export { tradeport } from './tradeport';
export { nftCollections } from './nft-collections';
```

### `api/src/ecosystem/projects/index.ts` (update — NFT block only)

```ts
import {
  nftLaunchpad,
  tradeportKiosk,
  tradeportListings,
  tradeportTransferPolicies,
  tradeport,
  nftCollections,
} from './nft/_index';

// …

// NFT (nftLaunchpad before tradeport* — more specific)
nftLaunchpad,
tradeportKiosk,
tradeportListings,
tradeportTransferPolicies,
tradeport,
nftCollections,
```

## Coverage after changes

| Rule                                                      | Captures         | Count       |
|-----------------------------------------------------------|------------------|-------------|
| `nftLaunchpad` (`all: launchpad, mint_box`)               | pkgs 4, 5, 6, 13 | 4           |
| `tradeportKiosk` (`any: kiosk_listings, kiosk_transfers`) | pkgs 7, 8, 9, 10 | 4           |
| `tradeportListings` (`exact: listings`)                   | pkgs 11, 12      | 2           |
| `tradeportTransferPolicies` (`packageAddresses`)          | pkg 14           | 1           |
| `tradeport` (`all: tradeport_biddings`)                   | pkgs 1, 2, 3     | 3           |
| — (skipped `nft_type`)                                    | pkg 15           | 0           |
| **Attributed total**                                      |                  | **14 / 15** |

Closes 6 of 7 previously-uncaptured packages. `nft_type` (pkg 15)
remains unclaimed; add to `TODO.md` as follow-up.

## False-match risk analysis (per rule)

### `tradeportKiosk` — `any: ['kiosk_listings', 'kiosk_transfers']`

- Current collisions on mainnet: **none**. Neither module name
  appears outside the Tradeport deployer.
- Semantic risk: low. These module names combine the IOTA Kiosk
  primitive with a clear marketplace verb; unlikely to collide with
  a non-marketplace project.
- Future risk: moderate if another marketplace ships a module named
  `kiosk_listings`. Mitigation: the `teamId: 'tradeport'` pins
  attribution, but a future matcher from a different team with the
  same module name would lose to whichever comes first in
  `ALL_PROJECTS`. Revisit if we ever onboard a second kiosk-native
  marketplace.

### `tradeportListings` — `exact: ['listings']`

- Current collisions: **none** (0 non-Tradeport packages with the
  exact module set `{listings}`).
- Semantic risk: moderate. `listings` is a common English word;
  another project could plausibly use it.
- Mitigation: the `exact:` form only fires when the module set is
  *exactly* `{listings}` — any other project would almost certainly
  ship `listings` alongside other modules (treasury, admin, etc.)
  and fall through this rule to `nftCollections` or similar. If a
  collision does appear, we can downgrade to `packageAddresses` for
  the two current packages.

### `tradeportTransferPolicies` — `packageAddresses`

- Current collisions: **avoided by design**. The `0x4ecf96…`
  deployer publishes the same 6-module set but a module-based rule
  would catch it; address-pinning isolates to the Tradeport copy.
- Future risk: upgrades to this package will deploy a *new* address.
  When that happens, the new address falls through all rules and
  goes unattributed until we add it to `packageAddresses`. Add a
  monitoring note — if `ecosystemService` ever reports a new 6-rule
  package at deployer `0xae24…bf1e`, append its address here.
- Not using `teamId` routing alone because the scanner does not
  currently route unmatched packages by deployer (the team-routing
  path in `ecosystem.service.ts:403` only fires for
  `splitByDeployer: true` aggregates with single-project teams, not
  for unmatched packages).

## Follow-ups

- Add `nft_type` package (`0x8c3edf53…ecffd`) either via a fourth
  `packageAddresses` def or as a candidate for the
  `deployerAddresses` rule type discussed in `handoff.md` option 2.
  Log in `TODO.md` under "Ecosystem project-def audit".
- When package 14 (`0x78eedfea…cc9`) upgrades, append the new
  address to `tradeportTransferPolicies.match.packageAddresses`.
- Consider the scanner-core change to add a `deployerAddresses`
  match rule type — would obviate all three draft defs *and* close
  `nft_type`, and would benefit the other multi-product teams
  (ObjectID, LiquidLink, TokenLabs) tracked in `threads.md`.
