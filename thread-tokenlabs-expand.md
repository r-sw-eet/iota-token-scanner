# Thread — TokenLabs registry expansion (rename + 4 new project defs)

## Goal

Apply the registry changes staged in `handoff.md`'s "Staking (generic)
→ TokenLabs [x] VERIFIED" section:

1. Rename team `staking-generic` → `tokenlabs`, add the second
   (admin/operator) deployer, fill in URLs + description +
   attribution prose.
2. Rename project `Staking` → `TokenLabs Staking Framework`.
3. Add three new project defs for the currently uncaptured TokenLabs
   packages:
   - `TokenLabs Liquid Staking (vIOTA)` — 2 packages.
   - `TLN Token` — 1 package.
   - `TokenLabs Payment` — 1 package.
4. Drop the dead `swirlValidator` def (0 live matches on mainnet,
   never matched any package in our history).

All code is drafted only (this file) — no edits under `api/src/` in
this pass.

## On-chain package inventory

Verified today via GraphQL against `graphql.mainnet.iota.cafe`.
Enumerated by paginating `transactionBlocks(filter: { signAddress })`
for each deployer and collecting every newly-created MovePackage
(`objectChanges` where `idCreated && asMovePackage != null`). Results
match the handoff exactly — 3 packages from `0x9bd8…9841`, 4 from
`0x5555…ae7c`, total 7.

### Deployer `0x9bd84e617831511634d8aca9120e90b07ba9e4fd920029e1fe4c887fc8599841` (staking framework)

3 upgrade versions of the same package, each carrying
`{stake, stake_config, stake_entries}`:

| #   | Package address                                                      | Modules                                  |
|-----|----------------------------------------------------------------------|------------------------------------------|
| 1   | `0xb62002179b008534f36eac97075f8822dd47bf287757bccce6671e7870ed747f` | `stake`, `stake_config`, `stake_entries` |
| 2   | `0xaf720252ba0238e4b2c98746b8d8d571f79634728d09defea0920a1a9fd8f799` | `stake`, `stake_config`, `stake_entries` |
| 3   | `0xd5c9963e521f8089611586104d08f6a68582ac2b515b35c2299b1ade03e2d47d` | `stake`, `stake_config`, `stake_entries` |

### Deployer `0x5555679093281ffa85c51c24b55fc45ff0f1bb6a57c0bee2c61eae3d5b54ae7c` (admin / operator)

4 distinct products:

| #   | Package address                                                      | Modules                                                     | Role                              |
|-----|----------------------------------------------------------------------|-------------------------------------------------------------|-----------------------------------|
| 1   | `0xb63c04714082f9edb86b4b8fd07f89f0afebb9e6a96dd1a360a810e17691b674` | `tln_token`                                                 | TLN utility token (coin type)     |
| 2   | `0xaa560ead3f1c756ac896b44585de0435e9761b8aeaf6cd6c9bf9a4fe8cec332b` | `simple_payment`                                            | Payment helper                    |
| 3   | `0xe4abf8b6183c106282addbfb8483a043e1a60f1fd3dd91fb727fa284306a27fd` | `cert`, `math`, `native_pool`, `ownership`, `validator_set` | vIOTA liquid staking v1           |
| 4   | `0x6ab984dfae09bbef27551765622a85f461e0b46629eee60807b6e5399c0f7f0f` | `cert`, `math`, `native_pool`, `ownership`, `validator_set` | vIOTA liquid staking v2 (upgrade) |

This confirms the handoff's `GlobalConfig` admin-address probe and
the "v1 / v2 upgrade" story — same 5-module signature, two different
package addresses.

### Collision check against all other mainnet packages

A full-mainnet scan (checkpoint-ranged `packages` feed) for the
proposed match signatures found:

| Proposed rule                                                      | Total on-chain hits | TokenLabs hits | Non-TokenLabs hits |
|--------------------------------------------------------------------|---------------------:|----------------:|--------------------:|
| `{all: [stake, stake_config]}`                                     | 13                  | 3              | 10                 |
| `{all: [cert, native_pool, validator_set]}`                        | 11                  | 2              | **9**              |
| `{exact: [tln_token]}`                                             | 1                   | 1              | 0                  |
| `{exact: [simple_payment]}`                                        | 1                   | 1              | 0                  |
| `{all: [cert, native_pool, validator]}` (current `swirlValidator`) | 0                   | 0              | 0                  |

Two collisions, both handled below:

- **stake framework:** the 10 non-TokenLabs hits are all Pools
  Finance's combined AMM+stake packages (senders `0x519e…800c` and
  `0xeada…88e7`). They also carry `amm_config` + `amm_router`, so
  the earlier-ordered `poolsFinance` rule already catches them
  before the staking rule fires. Current registry behavior stays
  correct after the rename.
- **vIOTA:** 9 non-TokenLabs `{cert, math, native_pool, ownership,
  validator_set}` hits come from `0x119191cd…40066` (early-
  checkpoint deployer, ~checkpoint 373k) and `0x13b068af…73040`.
  Neither is linked to TokenLabs; they're a separate, unregistered
  team shipping the same signature. This **breaks the
  `{all: cert + native_pool + validator_set}` rule from the
  handoff** — we cannot use module matching here without false-
  positively attributing those 9 packages to TokenLabs. The draft
  below uses `packageAddresses` instead.

Confirmation that `swirlValidator` is dead: zero packages carry
`{cert, native_pool, validator}` (singular `validator`). Safe to drop.

## Team rename draft

New file **`api/src/ecosystem/teams/misc/tokenlabs.ts`** (replaces
`staking-generic.ts`):

```ts
import { Team } from '../team.interface';

export const tokenlabs: Team = {
  id: 'tokenlabs',
  name: 'TokenLabs',
  description:
    'IOTA Rebased validator operator and DeFi staking platform. Issues TLN (native utility token, fair-launch 21M cap, no presale, 95% community / 5% team), operates vIOTA liquid staking, maintains reward farms (TLN/IOTA, TLN/TLN, Pools Finance LP farms), and powers the TokenLabs AI assistant (TLN is burned per-use). Two deployers: the staking-framework engine (`0x9bd8…9841`) and the admin/operator (`0x5555…ae7c`) that ships TLN, vIOTA, and the simple-payment helper.',
  urls: [
    { label: 'Website', href: 'https://tokenlabs.network' },
    { label: 'Analytics', href: 'https://tokenlabs.network/analytics' },
    { label: 'X', href: 'https://x.com/TokenLabsX' },
  ],
  deployers: [
    '0x9bd84e617831511634d8aca9120e90b07ba9e4fd920029e1fe4c887fc8599841',
    '0x5555679093281ffa85c51c24b55fc45ff0f1bb6a57c0bee2c61eae3d5b54ae7c',
  ],
  attribution: `
Attribution resolved via on-chain admin probe + public-site confirmation.

On-chain signal: a \`GlobalConfig\` object under the staking-framework package (\`::stake_config::GlobalConfig\` at \`0xad0c222b5bfe…\`) holds \`admin_address\`, \`emergency_admin_address\`, and \`treasury_admin_address\` — all three point to the vanity address \`0x5555679093281ffa85c51c24b55fc45ff0f1bb6a57c0bee2c61eae3d5b54ae7c\`. Scanning mainnet for packages deployed by that address surfaces four products whose module names map directly onto TokenLabs' public product surface: \`tln_token\` (the TLN utility token), \`{cert, math, native_pool, ownership, validator_set}\` (vIOTA liquid staking, two upgrade versions), and \`simple_payment\` (a payment helper).

Off-chain confirmation: [tokenlabs.network](https://tokenlabs.network) publicly bills itself as "an IOTA Rebased Validator & DeFi Staking Platform." TLN is their native utility token (21M fair-launch cap, decreasing-emission schedule from 10,000 TLN/day stepping to a 1,000 TLN/day floor). Staking rewards are paid in TLN; TLN is spent (and burned) in the TokenLabs AI tool, closing the utility loop. GeckoTerminal shows a live TLN/stIOTA pool on Pools Finance at \`0x168669080aafe…7320f\`, confirming cross-protocol composability with Swirl's stIOTA.

The original staking framework deployer (\`0x9bd8…9841\`) is registered as the first team deployer; the admin/operator (\`0x5555…ae7c\`) is the second. Both belong to the same team under the TokenLabs brand.
`.trim(),
};
```

Notes:

- No `logo` yet — once we have an SVG, drop it in
  `api/src/ecosystem/projects/logos/tokenlabs.svg` and add
  `logo: '/logos/tokenlabs.svg'` on the team (it will cascade to
  every TokenLabs project unless an individual def overrides).
- Filed under `teams/misc/` to match the current
  `staking-generic.ts` location. Could move to `teams/defi/` later
  to align with other DeFi teams, but mirroring the existing path
  keeps the diff minimal.

## Project defs draft

### 1. `TokenLabs Staking Framework` (renamed from `Staking`)

File: `api/src/ecosystem/projects/misc/staking.ts` — rename the
exported constant or keep `staking` as the binding but change the
`name` field. Prefer keeping the binding name `staking` so the
import site in `projects/misc/_index.ts` doesn't need to move, and
so git blame stays readable.

```ts
import { ProjectDefinition } from '../project.interface';

export const staking: ProjectDefinition = {
  name: 'TokenLabs Staking Framework',
  layer: 'L1',
  category: 'DeFi Staking',
  description: 'TokenLabs staking framework on IOTA Rebased. Generic `StakePool<StakingCoin, RewardCoin>` primitive that powers the 7 live TokenLabs farms — TLN/IOTA, TLN/TLN (self-stake with compound), Pools Finance LP token farms, and cross-protocol CERT/CERT pair farms. Engine deployer (`0x9bd8…9841`) ships the framework; the operator deployer (`0x5555…ae7c`) holds all three admin roles (admin, emergency admin, treasury) on the `::stake_config::GlobalConfig` object.',
  urls: [
    { label: 'Website', href: 'https://tokenlabs.network' },
    { label: 'Analytics', href: 'https://tokenlabs.network/analytics' },
  ],
  teamId: 'tokenlabs',
  match: { all: ['stake', 'stake_config'] },
  attribution: `
On-chain evidence: Move package with both \`stake\` and \`stake_config\` modules.

The match rule is unchanged from the previous "Staking" def; what changed is the attribution of the team. A \`GlobalConfig\` probe on \`0xad0c222b5bfe…\` (type \`::stake_config::GlobalConfig\`) revealed all three admin roles are held by \`0x5555…ae7c\`, which publicly operates as TokenLabs (tokenlabs.network) and also deploys the \`tln_token\`, vIOTA liquid-staking, and \`simple_payment\` packages. The engine deployer \`0x9bd8…9841\` publishes three upgrade versions of this framework.

Pools Finance also publishes packages containing \`stake\` + \`stake_config\` (bundled alongside their \`amm_*\` modules). Those are caught by the earlier \`poolsFinance\` rule (\`{all: [amm_config, amm_router]}\`) in match order, so they don't land here. The TokenLabs stand-alone staking-framework packages (no \`amm_*\` modules) reach this rule and are attributed correctly.
`.trim(),
};
```

### 2. `TokenLabs Liquid Staking (vIOTA)` (new)

File: new `api/src/ecosystem/projects/defi/tokenlabs.ts` (DeFi
category). **Uses `packageAddresses`, not module matching, because
9 non-TokenLabs packages on mainnet ship the same 5-module
signature.**

```ts
import { ProjectDefinition } from '../project.interface';

export const tokenlabsLiquidStaking: ProjectDefinition = {
  name: 'TokenLabs Liquid Staking (vIOTA)',
  layer: 'L1',
  category: 'Liquid Staking',
  description: 'TokenLabs\' liquid staking product — users stake IOTA and receive vIOTA, an LST that accrues validator rewards while remaining liquid. Second liquid-staking protocol on IOTA Rebased (alongside Swirl\'s stIOTA).',
  urls: [
    { label: 'Website', href: 'https://tokenlabs.network' },
  ],
  teamId: 'tokenlabs',
  match: {
    packageAddresses: [
      '0xe4abf8b6183c106282addbfb8483a043e1a60f1fd3dd91fb727fa284306a27fd', // v1
      '0x6ab984dfae09bbef27551765622a85f461e0b46629eee60807b6e5399c0f7f0f', // v2 upgrade
    ],
  },
  attribution: `
On-chain evidence: exact package addresses. Both packages are deployed by TokenLabs' admin/operator address \`0x5555…ae7c\` and carry the module set \`{cert, math, native_pool, ownership, validator_set}\`.

We do **not** use a module-signature rule here because a full-mainnet scan shows 9 other packages carry the same \`{cert, native_pool, validator_set}\` signature (deployers \`0x119191cd…40066\` and \`0x13b068af…73040\`), and we have no attribution linking those to TokenLabs. An \`{all: [cert, native_pool, validator_set]}\` rule would false-positively attribute them to TokenLabs. Address-pinning is the safe choice until/unless we verify those other deployers are TokenLabs too.

Note: \`validator_set\` (TokenLabs' module name) and \`validator\` (the module name our now-deleted \`swirlValidator\` rule looked for) are different. Neither Swirl nor TokenLabs ships \`validator\` as a standalone module name.
`.trim(),
};
```

### 3. `TLN Token` (new)

Same new file as above.

```ts
export const tlnToken: ProjectDefinition = {
  name: 'TLN Token',
  layer: 'L1',
  category: 'Token',
  description: 'TLN — TokenLabs\' native utility token. Fair-launch (no presale), 21M cap, 95% community / 5% team emission, decreasing-rate schedule from 10,000 TLN/day stepping to a 1,000 TLN/day floor. Earned by staking IOTA with TokenLabs; spent (burned) in TokenLabs AI.',
  urls: [
    { label: 'Website', href: 'https://tokenlabs.network' },
  ],
  teamId: 'tokenlabs',
  match: { exact: ['tln_token'] },
  attribution: `
On-chain evidence: Move package whose module set is exactly \`{tln_token}\` (no other modules). Deployed by TokenLabs' operator address \`0x5555…ae7c\`.

Exact-set match is appropriate because the module name \`tln_token\` is TokenLabs-specific (TLN is their branded utility token) and a full-mainnet scan confirms the module name is unique on IOTA today — no non-TokenLabs package ships a \`tln_token\` module.
`.trim(),
};
```

### 4. `TokenLabs Payment` (new)

```ts
export const tokenlabsPayment: ProjectDefinition = {
  name: 'TokenLabs Payment',
  layer: 'L1',
  category: 'Payment',
  description: 'Small payment helper module published by TokenLabs\' operator deployer. Role/usage not yet documented publicly; kept as a distinct row so activity on this package doesn\'t get lumped into the staking or vIOTA rows.',
  urls: [
    { label: 'Website', href: 'https://tokenlabs.network' },
  ],
  teamId: 'tokenlabs',
  match: {
    packageAddresses: [
      '0xaa560ead3f1c756ac896b44585de0435e9761b8aeaf6cd6c9bf9a4fe8cec332b',
    ],
  },
  attribution: `
On-chain evidence: exact package address. The module name \`simple_payment\` is deliberately generic — shipping an \`{exact: [simple_payment]}\` rule risks false-positives if another team ever publishes a one-module payment helper with that literal name. Current mainnet scan shows only the TokenLabs package, but the collision risk is elevated enough that address-pinning is safer and costs us nothing (this is a single, unlikely-to-be-upgraded package).

Attributed to TokenLabs via the deployer \`0x5555…ae7c\`, the same address that holds all three admin roles on the TokenLabs staking-framework \`GlobalConfig\` and that ships the \`tln_token\` and vIOTA liquid-staking packages.
`.trim(),
};
```

**Layout choice:** putting the three new defs (`tokenlabsLiquidStaking`,
`tlnToken`, `tokenlabsPayment`) in one file
`api/src/ecosystem/projects/defi/tokenlabs.ts` parallels how
`virtue.ts` groups `virtue / virtueStability / virtuePool`. The
existing `staking` def stays in `projects/misc/staking.ts` because
moving it would churn imports without changing behavior; DeFi placement
can be a follow-up if we prefer consistency later.

## Registry-index changes

### `api/src/ecosystem/teams/misc/_index.ts`

Remove:
```ts
export { stakingGeneric } from './staking-generic';
```

(And delete the file `staking-generic.ts`.) TokenLabs is registered
from a new `defi/_index.ts` entry — see below — but kept physically
under `teams/misc/` for now. Pick one of two paths:

**Option A (minimum diff):** keep `tokenlabs.ts` under `teams/misc/`,
export it from `teams/misc/_index.ts`:

```ts
export { tokenlabs } from './tokenlabs';
```

**Option B (cleaner):** move to `teams/defi/tokenlabs.ts`, export from
`teams/defi/_index.ts`. Requires adding the export there and updating
the `import` in `teams/index.ts`. Recommended.

### `api/src/ecosystem/teams/index.ts`

Replace `stakingGeneric` in the imports and in `ALL_TEAMS`:

- Remove from `./misc/_index` import: `stakingGeneric`.
- Under Option A: add `tokenlabs` to the `./misc/_index` import, and
  replace `stakingGeneric` with `tokenlabs` in the `ALL_TEAMS` list.
- Under Option B: add `tokenlabs` to the `./defi/_index` import,
  drop it from `./misc/_index`, and move the line from the misc
  section to the DeFi section of `ALL_TEAMS`.

### `api/src/ecosystem/projects/defi/_index.ts`

Add the new file:

```ts
export { tokenlabsLiquidStaking, tlnToken, tokenlabsPayment } from './tokenlabs';
```

And remove `swirlValidator`:

```ts
export { swirl } from './swirl';          // was: export { swirl, swirlValidator }
```

Also delete the `swirlValidator` export from
`api/src/ecosystem/projects/defi/swirl.ts` (keep the file, only
drop the second export).

### `api/src/ecosystem/projects/index.ts`

Swap imports and the `ALL_PROJECTS` array:

```ts
import { poolsFinance, poolsFarming, virtue, virtueStability, virtuePool, swirl, tokenlabsLiquidStaking, tlnToken, tokenlabsPayment } from './defi/_index';
// ...existing imports...
```

Drop `swirlValidator` from the import list.

`ALL_PROJECTS` changes — **match priority is driven by array order**,
so placement matters:

```ts
export const ALL_PROJECTS: ProjectDefinition[] = [
  // DeFi
  poolsFinance, poolsFarming,
  virtue, virtueStability, virtuePool,
  swirl,                              // swirlValidator dropped
  tokenlabsLiquidStaking,             // packageAddresses — order-insensitive in practice
  tlnToken,                           // exact:['tln_token'] — order-insensitive
  tokenlabsPayment,                   // packageAddresses — order-insensitive

  // Trade / Enterprise, Identity, Bridges, Oracles, NFT, Games — unchanged

  // Misc — `staking` stays here; it's now "TokenLabs Staking Framework"
  marketplaceEscrow, vault, tokenSale, easyPublish,
  giftDrop, pointsSystem, boltProtocol, staking,
  nativeStaking, iotaFramework,
  ifTesting,
];
```

## Rationale for match-rule specificity

Summarizing the decisions above in one place so a future reader can
see the "why":

1. **`TokenLabs Staking Framework` keeps `{all: [stake, stake_config]}`.**
   The framework deployer ships nothing but these three modules per
   package (`stake`, `stake_config`, `stake_entries`), and the only
   mainnet collisions are Pools Finance's bundled AMM+stake packages
   — which are caught earlier in `ALL_PROJECTS` by the
   Pools Finance rule. No change in behavior vs. the current `Staking`
   def; just a rename.

2. **`TokenLabs Liquid Staking (vIOTA)` uses `packageAddresses`, not
   `{all: [cert, native_pool, validator_set]}`.** The module-signature
   rule suggested in the handoff would false-positively attribute 9
   non-TokenLabs packages (deployers `0x119191cd…` and `0x13b068af…`)
   to TokenLabs. Pinning the 2 known vIOTA package addresses keeps
   attribution clean; we accept the cost of having to update this def
   whenever TokenLabs ships a vIOTA v3.

3. **`TLN Token` uses `{exact: [tln_token]}`.** Single-module exact-set
   match is the tightest module rule available. `tln_token` is
   branded (TLN = TokenLabs Network), and a full-mainnet scan finds
   no non-TokenLabs package shipping this module. Low collision risk.

4. **`TokenLabs Payment` uses `packageAddresses`, not
   `{exact: [simple_payment]}`.** The module name `simple_payment` is
   generic enough that some future unrelated team could plausibly
   ship a package with the same single-module set. No current
   collision, but the cost of address-pinning is minimal (single
   package, unlikely to be upgraded) and it eliminates the risk.

5. **`swirlValidator` def is dropped.** Full-mainnet scan for
   `{all: [cert, native_pool, validator]}` returns 0 results — the
   def has never matched any real package. It was speculative when
   written; now confirmed dead. Swirl's real validator-management
   infrastructure isn't published as a Move package today.

## Anti-regression tests to consider

Not required for the draft, but good candidates for the same PR:

- `ecosystem.service.spec.ts` — add a case that feeds a synthetic
  package with modules `{cert, math, native_pool, ownership,
  validator_set}` deployed by a non-TokenLabs address and asserts it
  is **not** classified as TokenLabs Liquid Staking. Prevents the
  handoff's module-rule suggestion from sneaking back in.
- Add a case with a `tln_token`-only package and assert it maps to
  `TLN Token` / team `tokenlabs`.
- Add a case with a TokenLabs vIOTA package address and assert it
  maps to `TokenLabs Liquid Staking (vIOTA)`.
