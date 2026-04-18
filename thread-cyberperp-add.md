# Cyberperp L1 — registry additions (draft)

Draft-only artifact for thread "CyberPerp L1 — add new team + projects"
(`threads.md` §Registry-expansion, `handoff.md` §"Cyberperp (L1 Move)
[x] VERIFIED"). No files under `api/src/` changed; this document holds
paste-ready code + the ordering notes and disclaimer copy.

## Goal

Surface CyberPerp's L1 Move deployment on the scanner. CyberPerp is
already on the site via DefiLlama (L2 EVM: `defillama.com/protocol/cyberperp`);
its 11 L1 Move packages deployed from
`0x14effa2d3435b7c462a969db6995003cfd3db97f403ad9dd769d0a36413fc3e0`
are currently invisible (and were previously misattributed to Virtue
via the `{all:['liquidity_pool','delegates']}` match — fix for Virtue
is covered by the separate Virtue-correction thread).

## On-chain inventory (verified 2026-04-17)

Re-queried `graphql.mainnet.iota.cafe` `packages` root; filtered by
`previousTransactionBlock.sender.address ==
0x14effa2d3435b7c462a969db6995003cfd3db97f403ad9dd769d0a36413fc3e0`.
Full-drain scan (15 pages of 50, 747 packages on mainnet total) —
11 matches, identical count and shape to the handoff. Grouped by
module signature:

### 19-module GMX-style perps engine — 4 upgrade versions

Module set (all 4 identical):
`delegates, liquidity_pool, market, price_oracle, pyth, referral,
rewards_manager, router_delegates, router_liquidity_pool,
router_price_oracle, router_referral, router_rewards_manager,
router_trading, router_vault, trading, trading_calc, utils, vault,
vault_type`.

| Package                                                              | storageRebate |
|----------------------------------------------------------------------|---------------|
| `0xfdccf09798b9265b5a774c2ecbe65a54dbd62ebd0f7645c35d53a2d0d9e9cf21` | 414 975 200   |
| `0x9ce7f6e1575d59241a4e9d8029ed527ec01e867bfb8639698c483b5757bcd079` | 452 557 200   |
| `0x9b92d88f8f7954bc3dee8c3439937498f3ce769df2ec0c3d9878cf64df1dae74` | 452 716 800   |
| `0xc678dba26e4469c74e796057174e999bf867a66a59203ec66a868c527c44f154` | 454 297 600   |

### `market`-only packages — 3

Modules: `market` (single module).

| Package                                                              | storageRebate |
|----------------------------------------------------------------------|---------------|
| `0xc24f0c5b3f43980a0c22fa64280c3dc4f7e3d8fc68ebcc3342ad9633af5b5f13` | 2 720 800     |
| `0xb4e1cdb8d5725dd45738322d2a1a5f9f323275b3ba674d71f68ae4deae9ae2fb` | 4 674 000     |
| `0x2ba3a07b1fe130815f084340e9b46ef73d06731696899ed9be7aa7b8c65ea10e` | 5 624 000     |

### DEX / yield-farm — 2

Modules: `config, router, script, swap, utils, yield_farm`.

| Package                                                              | storageRebate |
|----------------------------------------------------------------------|---------------|
| `0x3632c949dd8e2437b7facdbe3bac69d3c3d9cdedc4d52a2d8a369d324b68edde` | 141 284 000   |
| `0x42af8139d65b2f7ef6d76739ccca59c519bc73bc89265b77299d48c58b6abb40` | 141 899 600   |

### CYB token — 1

Module: `cyb` (single module, L1 Move companion to their EVM CYB
token).

| Package                                                              | storageRebate |
|----------------------------------------------------------------------|---------------|
| `0x1ec64aa5356180866521292ebefb778a16e2852380ff6425784ebc62fc98463f` | 7 531 600     |

### LayerZero OFT wrapper — 1

Modules: `oft, oft_fee, oft_fee_detail, oft_impl, oft_info_v1,
oft_limit, oft_msg_codec, oft_ptb_builder, oft_receipt,
oft_send_context, oft_sender, pausable, rate_limiter, send_param`.

| Package                                                              | storageRebate |
|----------------------------------------------------------------------|---------------|
| `0xfdbeee284bf8bc25ec34d30a2eeebdeb551d105aa4fcd42e1dea7d8161bc299d` | 165 026 400   |

All 11 packages consistent with a GMX-style perps exchange + spot
DEX + cross-chain token bridge, exactly the CyberPerp product
surface. Zero off-topic packages.

## Team file draft — `api/src/ecosystem/teams/defi/cyberperp.ts`

```ts
import { Team } from '../team.interface';

export const cyberperp: Team = {
  id: 'cyberperp',
  name: 'Cyberperp',
  description: 'GMX-style decentralized spot and perpetual exchange. Primary deployment is on IOTA EVM (L2); this L1 Move companion ships the CYB token, a GMX-fork perps engine, a swap/yield-farm, and a LayerZero OFT bridge to move CYB between L1 Move and L2 EVM.',
  urls: [
    { label: 'Website', href: 'https://cyberperp.io' },
    { label: 'Docs', href: 'https://docs.cyberperp.io' },
  ],
  deployers: [
    '0x14effa2d3435b7c462a969db6995003cfd3db97f403ad9dd769d0a36413fc3e0',
  ],
  attribution: `
Deployer \`0x14ef…c3e0\` is Cyberperp's L1 Move companion deployer. Cyberperp's primary product is on IOTA EVM (L2, tracked in our registry via DefiLlama); this address publishes the L1 Move side of the same stack.

Gold-standard attestation:

- MoveBit audit "Cyberperp Audit Report" (work period July 28 – August 22 2025, report dated September 19 2025 / revised 2025-10-9) linked directly from Cyberperp's own audits page at \`docs.cyberperp.io/cyberperp/audits\`. Platform listed as IOTA Rebased, language Move, source repo \`github.com/ttbbio/cyberperp_rebased_contracts\` (ttbbio is Cyberperp's dev-team GitHub handle). Auditor MoveBit (contact@bitslab.xyz) — the same firm that audited Virtue.
- Cyberperp's public docs describe the product as "a decentralized spot and perpetual exchange built on the Iota Rebased" and list three audits (two QuillAudits for EVM V1/V2, plus the MoveBit Rebased audit), making the L1 Move deployment officially disclosed.
- On-chain scan of \`0x14ef…c3e0\` returns 11 packages whose module signatures match a GMX-style perps engine (4 upgrade versions of a 19-module package: \`delegates, liquidity_pool, market, price_oracle, pyth, referral, rewards_manager, router_*, trading, trading_calc, vault, vault_type\`), a spot DEX + yield farm (\`swap, yield_farm, router, config, script\`), the CYB coin (\`cyb\` module), and a LayerZero OFT wrapper (14 \`oft_*\` + \`pausable\` / \`rate_limiter\` modules). Shape is exactly what Cyberperp's product surface predicts.

This deployer was previously misattributed to Virtue in the registry (Virtue's \`{liquidity_pool, delegates}\` match rule swept up Cyberperp's 19-module engine). The Virtue correction is a separate thread; this team file establishes the correct owner for \`0x14ef…c3e0\`.
`.trim(),
};
```

Notes:

- No `logo` field yet — add `/logos/cyberperp.svg` if and when a logo
  asset is dropped into `api/src/ecosystem/projects/logos/`. Until
  then the website falls back to the "CP" initials circle.
- Single deployer; no ambiguity about ownership (unlike Virtue's
  split across two addresses).

## Project-defs draft — `api/src/ecosystem/projects/defi/cyberperp.ts`

```ts
import { ProjectDefinition } from '../project.interface';

export const cyberperpPerps: ProjectDefinition = {
  name: 'Cyberperp Perps',
  layer: 'L1',
  category: 'Perpetuals (GMX-fork)',
  description: 'GMX-style perpetuals engine — Cyberperp\'s main trading product. Traders take leveraged long/short positions against a shared liquidity pool; the package bundles the trading, vault, pricing (Pyth), referral, and rewards-manager primitives. This is the L1 Move companion to Cyberperp\'s IOTA EVM perps deployment (tracked separately via DefiLlama).',
  urls: [
    { label: 'App', href: 'https://cyberperp.io' },
    { label: 'Docs', href: 'https://docs.cyberperp.io' },
  ],
  teamId: 'cyberperp',
  match: { all: ['trading', 'liquidity_pool', 'router_trading'] },
  attribution: `
On-chain evidence: Move package with all three of \`trading\`, \`liquidity_pool\`, and \`router_trading\` modules.

The triple \`trading + liquidity_pool + router_trading\` is textbook GMX-fork terminology — \`router_trading\` in particular is a GMX-lineage naming convention (router-layer handlers for trading entry points) used by very few protocols. Cyberperp's main engine package ships 19 modules including this triple; four on-chain upgrade versions of this package share the exact same module set, all deployed from \`0x14ef…c3e0\` (the Cyberperp team deployer). Attribution to the Cyberperp team is via deployer membership; this project row collapses the four upgrades into one product entry.
`.trim(),
};

export const cyberperpSwap: ProjectDefinition = {
  name: 'Cyberperp Swap',
  layer: 'L1',
  category: 'DEX + Yield Farm',
  description: 'Spot DEX and yield-farming product from the Cyberperp team. Users swap tokens via a router-style AMM and stake LP positions into farms. Companion to the Cyberperp Perps engine on the same L1 Move deployment.',
  urls: [
    { label: 'App', href: 'https://cyberperp.io' },
    { label: 'Docs', href: 'https://docs.cyberperp.io' },
  ],
  teamId: 'cyberperp',
  match: { all: ['swap', 'yield_farm', 'router'] },
  attribution: `
On-chain evidence: Move package with all three of \`swap\`, \`yield_farm\`, and \`router\` modules.

This module triple is the canonical naming for a UniswapV2-style swap + farming product. Two upgrade versions of this package are deployed from Cyberperp's deployer \`0x14ef…c3e0\` alongside the perps engine, confirming it's the swap + farm sibling product (and not an unrelated third-party DEX sharing generic module names). Team attribution via deployer membership.
`.trim(),
};

export const cyberperpCyb: ProjectDefinition = {
  name: 'CYB (L1 Move)',
  layer: 'L1',
  category: 'Token',
  description: 'L1 Move version of the CYB coin — Cyberperp\'s governance/utility token. Companion to the CYB token on IOTA EVM (the original CYB); packages are bridged between layers via Cyberperp\'s LayerZero OFT wrapper.',
  urls: [
    { label: 'Website', href: 'https://cyberperp.io' },
    { label: 'Docs', href: 'https://docs.cyberperp.io' },
  ],
  teamId: 'cyberperp',
  match: { exact: ['cyb'] },
  attribution: `
On-chain evidence: single-module Move package whose module set is exactly \`{cyb}\`.

Small storage footprint (coin-type packages typically are) but kept as its own project row so the token-publish event is visible rather than swept into a generic "misc" bucket. \`exact\` match guards against false positives — only a package shipping literally one module named \`cyb\` qualifies, and the only such package on mainnet is deployed from Cyberperp's deployer \`0x14ef…c3e0\`. Team attribution via deployer membership.
`.trim(),
};

export const cyberperpOft: ProjectDefinition = {
  name: 'Cyberperp OFT',
  layer: 'L1',
  category: 'Bridge (OFT)',
  description: 'LayerZero OFT wrapper for Cyberperp\'s CYB token — lets CYB flow cross-chain between IOTA Rebased (L1 Move) and IOTA EVM (L2). Built on LayerZero\'s Omnichain Fungible Token pattern; adds Cyberperp-specific pausable + rate-limiter controls on top of the standard OFT modules.',
  urls: [
    { label: 'Website', href: 'https://cyberperp.io' },
    { label: 'Docs', href: 'https://docs.cyberperp.io' },
  ],
  teamId: 'cyberperp',
  match: { all: ['oft', 'oft_impl', 'pausable', 'rate_limiter'] },
  attribution: `
On-chain evidence: Move package with all four of \`oft\`, \`oft_impl\`, \`pausable\`, and \`rate_limiter\` modules.

Strict superset of the generic \`layerZeroOft\` bucket's match rule (\`{oft, oft_impl}\`) — the extra \`pausable\` + \`rate_limiter\` requirement distinguishes a team-operated OFT wrapper (with admin pause and per-epoch transfer caps) from a bare-bones OFT. The single package matching this rule on mainnet is Cyberperp's \`0xfdbe…299d\` (14 modules total: \`oft, oft_fee, oft_fee_detail, oft_impl, oft_info_v1, oft_limit, oft_msg_codec, oft_ptb_builder, oft_receipt, oft_send_context, oft_sender, pausable, rate_limiter, send_param\`), deployed from \`0x14ef…c3e0\`. **This project must appear BEFORE \`layerZeroOft\` in \`ALL_PROJECTS\`** or the aggregate bucket will claim the package first (see match-order note below).
`.trim(),
};
```

Notes:

- The 3 standalone `market`-only packages are intentionally NOT given
  their own project row. They have a single generic module name that
  can't be distinguished by shape from any other `market`-only
  package in the ecosystem; attribution to Cyberperp is solely via
  the deployer. They'll show up on the project-details page for the
  Cyberperp team as "unclaimed by any project match but deployed by
  this team" if/when we expose that view, but adding a
  `{exact:['market']}` project def would create a classic
  false-positive magnet. Left as a conscious gap.
- No `logo` override on any of the four — all inherit from the team
  file (so adding `/logos/cyberperp.svg` later lights up all four
  rows).
- Descriptions are all under 500 chars per the interface contract
  and over 50.

## Match-order requirements

`ALL_PROJECTS` order matters — first match wins. Two specific
ordering constraints emerge from these additions:

1. **`cyberperpOft` MUST come before `layerZeroOft`.**
   `layerZeroOft` matches `{all: ['oft', 'oft_impl']}` with
   `splitByDeployer: true`; Cyberperp's OFT package contains both
   modules, so if `layerZeroOft` is checked first the package
   becomes an aggregate-bucket sub-project keyed by the Cyberperp
   deployer hash instead of routing to a proper Cyberperp row. The
   strict superset `{oft, oft_impl, pausable, rate_limiter}` on
   `cyberperpOft` means placing it first is both safe (it only
   matches the Cyberperp package) and necessary.
2. **Within Cyberperp, ordering doesn't matter** — the four project
   matches are mutually exclusive on this deployer's packages
   (verified by re-running the shape scan). `cyberperpPerps` match
   doesn't overlap `cyberperpSwap` (no `trading` module on the swap
   package), neither overlaps `cyberperpCyb` (single-module `cyb`
   package), and none overlaps `cyberperpOft`.

Separately: the Virtue correction (remove the `{liquidity_pool,
delegates}` rule) is a prerequisite for clean routing — without it
`virtue` would still try to claim the Cyberperp perps engines first.
That fix is owned by the Virtue thread and listed as such in
`threads.md`; flagging here so the two changes ship as one PR or
Virtue ships first.

## Registry-index diff

### `api/src/ecosystem/teams/defi/_index.ts`

```diff
 export { poolsFinance } from './pools-finance';
 export { virtue } from './virtue';
 export { swirl } from './swirl';
+export { cyberperp } from './cyberperp';
```

### `api/src/ecosystem/projects/defi/_index.ts`

```diff
 export { poolsFinance, poolsFarming } from './pools-finance';
 export { virtue, virtueStability, virtuePool } from './virtue';
 export { swirl, swirlValidator } from './swirl';
+export { cyberperpPerps, cyberperpSwap, cyberperpCyb, cyberperpOft } from './cyberperp';
```

### `api/src/ecosystem/teams/index.ts`

```diff
-import { poolsFinance, virtue, swirl } from './defi/_index';
+import { poolsFinance, virtue, swirl, cyberperp } from './defi/_index';
 ...
 export const ALL_TEAMS: Team[] = [
   // DeFi
   poolsFinance,
   virtue,
   swirl,
+  cyberperp,
   ...
 ];
```

### `api/src/ecosystem/projects/index.ts`

```diff
 import { poolsFinance, poolsFarming, virtue, virtueStability, virtuePool, swirl, swirlValidator } from './defi/_index';
+import { cyberperpPerps, cyberperpSwap, cyberperpCyb, cyberperpOft } from './defi/_index';
 ...
 export const ALL_PROJECTS: ProjectDefinition[] = [
   // DeFi
   poolsFinance, poolsFarming,
   virtue, virtueStability, virtuePool,
   swirl, swirlValidator,
+  cyberperpPerps, cyberperpSwap, cyberperpCyb,
 
   // Trade / Enterprise
   tlip, notarization, traceability, salus,
 
   // Identity (identityFull before identityWot — more specific)
   identityFull, identityWot, oidIdentity, credentials,
 
   // Bridges
-  ibtcBridge, layerZero, layerZeroOft, wormhole,
+  ibtcBridge, layerZero,
+  // cyberperpOft must precede layerZeroOft — strict superset match, see thread-cyberperp-add.md
+  cyberperpOft, layerZeroOft,
+  wormhole,
   ...
 ];
```

Notes on the diff:

- The three perps + swap + cyb defs stay grouped under `// DeFi`
  (they're DeFi products); `cyberperpOft` lives under `// Bridges`
  next to `layerZeroOft` so the ordering constraint is obvious at
  the import-list level. An inline comment on the `cyberperpOft,
  layerZeroOft,` line documents the "must precede" requirement —
  matches the style of the existing `identityFull, identityWot —
  more specific` / `nftLaunchpad, nftCollections — more specific`
  comments.
- Alternative that co-locates everything: move `cyberperpOft` into
  the `// DeFi` block and leave a comment above `layerZeroOft`
  saying "known OFT wrappers handled above". Slightly worse because
  it splits Bridges across two places and hides the ordering
  dependency. The per-line inline comment is preferred.

## L1/L2 dual-visibility caveat + disclaimer draft

With these changes the scanner's landing page will show TWO
Cyberperp rows:

1. **L1 Cyberperp rows** (four: Perps, Swap, CYB token, OFT) —
   sourced from on-chain Move activity scanned by the ecosystem
   service.
2. **L2 Cyberperp row** — sourced from DefiLlama's
   `chains: ['IOTA EVM']` entry for the protocol (pre-existing, not
   touched by this thread).

Accurate — Cyberperp genuinely operates on both layers — but a
casual reader may interpret the duplication as a scanner bug or
double-counted TVL. Mitigations (pick one; recommend 2a):

### Option 2a — single-sentence disclaimer on the flagship L1 row only

Add a trailing sentence to the L1 `cyberperpPerps` description:

> "GMX-style perpetuals engine — Cyberperp's main trading product.
> Traders take leveraged long/short positions against a shared
> liquidity pool; the package bundles the trading, vault, pricing
> (Pyth), referral, and rewards-manager primitives. **Cyberperp's
> primary deployment is on IOTA EVM (L2, shown separately via
> DefiLlama); this row covers the L1 Move companion only.**"

The existing description above is already paraphrased in this
direction but the disclaimer makes the overlap explicit. The other
three Cyberperp rows inherit context from adjacency in the table
and don't need their own disclaimer.

### Option 2b — `disclaimer` field on all four L1 rows

Use the interface's `disclaimer` field (currently used on
`layerZeroOft` for the aggregate-bucket caveat). Something like:

```ts
disclaimer: 'Cyberperp operates on both IOTA EVM (L2, tracked via DefiLlama) and IOTA Rebased (L1 Move, tracked here). Both rows are genuine; TVL / volume numbers are layer-specific and not double-counted — the L1 row only reflects Move-layer activity.',
```

Tradeoff: consistent but noisier — the disclaimer pops up on every
Cyberperp row. If the landing UI dims `disclaimer`-bearing rows or
shows them with an icon, this is clutter; if it only surfaces on
project-details pages, this is fine.

### Option 2c — L2 side (DefiLlama row) mirror disclaimer

Harder to do cleanly because the L2 rows are generated from the
DefiLlama feed and we don't currently store per-protocol copy for
them. Would need a new override table or a patch in the DefiLlama
integration layer. Out of scope for this thread; park as a later
follow-up if Option 2a's L1-only disclaimer proves insufficient.

### Recommendation

Ship with **Option 2a** — minimum churn, disclaimer lives in
prose where users read it, and the interface contract doesn't
need an extra `disclaimer` field on every row. If user feedback
shows the duplication is still confusing, escalate to 2b.

## Files produced by this thread

- `thread-cyberperp-add.md` (this file)

## Files to create when implementing (out of scope here)

- `api/src/ecosystem/teams/defi/cyberperp.ts`
- `api/src/ecosystem/projects/defi/cyberperp.ts`
- Edits to four `_index.ts` + `index.ts` files as per the diff
  above.
- Optional: `api/src/ecosystem/projects/logos/cyberperp.svg` for the
  logo fallback — wire via `cyberperp.logo = '/logos/cyberperp.svg'`
  in the team file.
