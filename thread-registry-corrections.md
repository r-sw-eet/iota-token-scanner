# Registry corrections — unified patch plan

Consolidated patch draft for the queued registry renames, misattribution
fixes, and dead-def cleanups from `handoff.md` / `threads.md`. This
thread covers **only** the corrections listed below — TokenLabs,
LiquidLink, ObjectID, Tradeport, LayerZero, and Notarization are handled
by other threads with their own expansion docs.

Scope:

1. Virtue — misattribution fix + dead-def cleanup
2. Swirl Validator — dead-def removal
3. iBTC → Echo Protocol (team + project rename)
4. Bolt Protocol → Bolt.Earth (team + project rename)
5. Easy Publish → izipublish (rename + description rewrite + extra deployer)
6. Gambling → IOTA Flip (rename)
7. TLIP — promote from `if-tlip` to standalone `tlip`

No changes are applied in `api/src/` by this thread — everything below is
a draft. Execution sequence is at the end.

File paths throughout are absolute for unambiguous patching.

---

## 1. Virtue — misattribution fix + dead-def cleanup

### Context

Current state:

- Team `virtue` lists two deployers, one of which
  (`0x14effa2d3435b7c462a969db6995003cfd3db97f403ad9dd769d0a36413fc3e0`)
  is actually CyberPerp L1, not Virtue.
- Project `virtue` matches `{all: ['liquidity_pool', 'delegates']}` —
  that pair matches CyberPerp's GMX-fork package (19 modules including
  `liquidity_pool` and `delegates`), **not** any of Virtue's real
  packages. Virtue does not ship a `liquidity_pool` module at all.
- Project `virtueStability` (match `{all: ['stability_pool',
  'borrow_incentive']}`) matches zero packages on mainnet. Virtue's
  borrow-incentive packages ship `stability_pool_incentive`, not
  `stability_pool`, so the rule is dead.
- Project `virtuePool` (match `{all: ['balance_number',
  'stability_pool']}`) actually matches Virtue's real **Stability Pool**
  primitive at `0xc7ab9b93…d83b`, just under the misleading name
  "Virtue Pool".

Virtue publishes its five canonical contract addresses on
`docs.virtue.money/resources/technical-resources`:

| Contract       | Address                                                              |
|----------------|----------------------------------------------------------------------|
| Framework      | `0x7400af41a9b9d7e4502bc77991dbd1171f90855564fd28afa172a5057beb083b` |
| VUSD Treasury  | `0xd3b63e603a78786facf65ff22e79701f3e824881a12fa3268d62a75530fe904f` |
| Oracle         | `0x7eebbee92f64ba2912bdbfba1864a362c463879fc5b3eacc735c1dcb255cc2cf` |
| CDP            | `0x34fa327ee4bb581d81d85a8c40b6a6b4260630a0ef663acfe6de0e8ca471dd22` |
| Stability Pool | `0xc7ab9b9353e23c6a3a15181eb51bf7145ddeff1a5642280394cd4d6a0d37d83b` |

All five deploy from `0xf67d0193…5a12`.

### Files touched

- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/teams/defi/virtue.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/projects/defi/virtue.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/projects/defi/_index.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/projects/index.ts`

### 1.1. Team `virtue` — drop the CyberPerp deployer

In `teams/defi/virtue.ts`, change three fields (id/name/urls/logo stay):

```ts
// description: change to
description: 'First native stablecoin (VUSD) protocol on IOTA Rebased — CDP, unified stability pool, flash loans. All five canonical contracts (Framework, VUSD Treasury, Oracle, CDP, Stability Pool) are published from a single deployer and listed in Virtue\'s public docs.',

// deployers: drop '0x14effa2d…c3e0', keep only '0xf67d0193…5a12'
deployers: [
  '0xf67d0193e9cd65c3c8232dbfe0694eb9e14397326bdc362a4fe9d590984f5a12',
],

// attribution: replace with
attribution: `
Deployer \`0xf67d…5a12\` publishes all five canonical Virtue contracts (Framework, VUSD Treasury, Oracle, CDP, Stability Pool) — addresses disclosed on docs.virtue.money/resources/technical-resources. MoveBit audit (Jul 2025, github.com/Virtue-CDP/virtue-audits) references the same codebase. The previously-listed deployer \`0x14ef…c3e0\` was a misattribution — that address belongs to CyberPerp's L1 Move deployment (GMX-style perps), not Virtue.
`.trim(),
```

### 1.2. Project `virtue` — replace generic module match with hardcoded addresses

In `projects/defi/virtue.ts`, change the `match` and `attribution` of
the `virtue` export (name/layer/category/description/urls/teamId
unchanged):

```ts
// match: replace with packageAddresses for 4 of Virtue's 5 canonical
// contracts (Stability Pool is owned by the virtueStabilityPool row)
match: {
  packageAddresses: [
    // Framework
    '0x7400af41a9b9d7e4502bc77991dbd1171f90855564fd28afa172a5057beb083b',
    // VUSD Treasury (ships the VUSD coin type)
    '0xd3b63e603a78786facf65ff22e79701f3e824881a12fa3268d62a75530fe904f',
    // Oracle
    '0x7eebbee92f64ba2912bdbfba1864a362c463879fc5b3eacc735c1dcb255cc2cf',
    // CDP
    '0x34fa327ee4bb581d81d85a8c40b6a6b4260630a0ef663acfe6de0e8ca471dd22',
  ],
},

// attribution: replace with
attribution: `
On-chain evidence: four hardcoded package addresses (Framework, VUSD Treasury, Oracle, CDP) published on docs.virtue.money/resources/technical-resources and all deployed from \`0xf67d…5a12\`. The fifth disclosed address (Stability Pool, \`0xc7ab9b93…d83b\`) is matched separately by the "Virtue Stability Pool" row.

Virtue Money is the first native stablecoin (VUSD) protocol on IOTA Rebased. The previous module-match rule (\`{all: ['liquidity_pool', 'delegates']}\`) was incorrect — those modules belong to CyberPerp's GMX-fork package, not Virtue. Virtue does not ship a \`liquidity_pool\` module at all.
`.trim(),
```

The Stability Pool address `0xc7ab9b93…d83b` is intentionally omitted
from `packageAddresses` here because it's claimed by the renamed
`virtueStabilityPool` row below — `packageAddresses` wins over module
matchers, so listing it here would steal events.

### 1.3. Project `virtueStability` — remove (dead def)

Drop the `virtueStability` export in `projects/defi/virtue.ts` entirely.
The match rule `{all: ['stability_pool', 'borrow_incentive']}` matches
zero packages on mainnet today (Virtue's real incentive packages ship
`stability_pool_incentive`, not `stability_pool`).

### 1.4. Project `virtuePool` → rename to `virtueStabilityPool`

Rename the export and rewrite the user-facing fields. Match rule
(`{all: ['balance_number', 'stability_pool']}`) stays — it already
catches Virtue's real Stability Pool package at `0xc7ab9b93…d83b`.

```ts
// rename export + name, broaden description/urls/attribution
export const virtueStabilityPool: ProjectDefinition = {
  name: 'Virtue Stability Pool',
  layer: 'L1',
  category: 'Stability Pool',
  description: 'Virtue\'s unified Stability Pool primitive — VUSD depositors absorb CDP liquidations and earn collateral rewards. One of the five canonical Virtue contracts listed on docs.virtue.money.',
  urls: [
    { label: 'App', href: 'https://virtue.money' },
    { label: 'Docs', href: 'https://docs.virtue.money/resources/technical-resources' },
  ],
  teamId: 'virtue',
  match: { all: ['balance_number', 'stability_pool'] },
  attribution: `
On-chain evidence: Move package with modules \`balance_number\` and \`stability_pool\`. Matches Virtue's canonical Stability Pool contract at \`0xc7ab9b93…d83b\` (published on docs.virtue.money/resources/technical-resources) and its upgrade versions, all under deployer \`0xf67d…5a12\`.

Kept as a separate project row from the umbrella \`Virtue\` entry so stability-pool events (deposits, liquidations, reward claims) have their own event profile. Previously mis-labeled "Virtue Pool" against a stale understanding that this was a small accounting helper; in fact it's the full Stability Pool primitive as documented by Virtue.
`.trim(),
};
```

### 1.5. `projects/defi/_index.ts` and `projects/index.ts`

Both files update together to cover Virtue (section 1) + Swirl (section 2).

`projects/defi/_index.ts`:
```ts
// before
export { virtue, virtueStability, virtuePool } from './virtue';
export { swirl, swirlValidator } from './swirl';
// after
export { virtue, virtueStabilityPool } from './virtue';
export { swirl } from './swirl';
```

`projects/index.ts`:
```ts
// before
import { poolsFinance, poolsFarming, virtue, virtueStability, virtuePool, swirl, swirlValidator } from './defi/_index';
...
  virtue, virtueStability, virtuePool,
  swirl, swirlValidator,
// after
import { poolsFinance, poolsFarming, virtue, virtueStabilityPool, swirl } from './defi/_index';
...
  virtue, virtueStabilityPool,
  swirl,
```

---

## 2. Swirl Validator — dead-def removal

### Context

Project `swirlValidator` matches `{all: ['cert', 'native_pool',
'validator']}`. A full-mainnet scan confirms zero packages on IOTA
mainnet contain all three of those modules. TokenLabs uses
`validator_set` (not `validator`); Swirl itself only ships `{pool,
riota}`. The def is dead weight.

### Files touched

- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/projects/defi/swirl.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/projects/defi/_index.ts` (already covered above)
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/projects/index.ts` (already covered above)

### 2.1. Project `swirlValidator` — remove

Drop the `swirlValidator` export in `projects/defi/swirl.ts` entirely.
`_index.ts` and `projects/index.ts` updates are already shown in
section 1.5.

---

## 3. iBTC → Echo Protocol (rename)

### Context

Hacken audited the bridge for **Echo Protocol** in Jul–Aug 2025. iBTC is
just one of the bridged assets the 9-module bridge package mints.
Renaming the team/project reflects the true brand.

### Files touched

- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/teams/bridges/ibtc.ts` → rename to `echo-protocol.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/projects/bridges/ibtc-bridge.ts` → rename to `echo-protocol-bridge.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/teams/bridges/_index.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/projects/bridges/_index.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/teams/index.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/projects/index.ts`

### 3.1. Team `ibtc` → `echo-protocol`

New file `teams/bridges/echo-protocol.ts` (replacing `ibtc.ts`):

```ts
import { Team } from '../team.interface';

export const echoProtocol: Team = {
  id: 'echo-protocol',
  name: 'Echo Protocol',
  description: 'Bitcoin liquidity and bridge infrastructure — the BTCFi operator that also runs on Aptos. Ships a multi-asset bridge on IOTA Rebased whose first product is iBTC, the first native Bitcoin asset in the IOTA ecosystem.',
  urls: [
    { label: 'Website', href: 'https://www.echo-protocol.xyz' },
  ],
  deployers: ['0x95ec54247e108d3a15be965c5723fee29de62ab445c002fc1b8a48bfc6fb281e'],
  attribution: `
Deployer \`0x95ec…281e\` publishes the 9-module bridge package (\`bridge, chain_ids, committee, crypto, ibtc, limiter, message, message_types, treasury\`). Hacken audited Echo Protocol's IOTA bridge in Jul–Aug 2025 — the audit report (hacken.io/audits/echo-protocol/sca-echo-protocol-bridge-iota-jul2025) names exactly those 9 modules in scope, and names Echo Protocol as the customer with source repo \`github.com/echo-proto/bridge-iota\`. Five upgrade versions on mainnet, all with the same 9-module signature. Previously tracked as team "iBTC" — renamed because iBTC is one bridged asset (the first native Bitcoin token on IOTA) within Echo Protocol's broader multi-asset bridge.
`.trim(),
};
```

Confirm the `https://www.echo-protocol.xyz` URL before committing — the
handoff flags it as "confirm actual URL before adding." If not
confirmed at patch time, drop the `urls` field and add a TODO.

### 3.2. Project `iBTC Bridge` → `Echo Protocol Bridge`

New file `projects/bridges/echo-protocol-bridge.ts` (replacing
`ibtc-bridge.ts`):

```ts
import { ProjectDefinition } from '../project.interface';

export const echoProtocolBridge: ProjectDefinition = {
  name: 'Echo Protocol Bridge',
  layer: 'L1',
  category: 'Bridge',
  description: 'Echo Protocol\'s multi-asset bridge on IOTA Rebased. Enables trustless transfer of Bitcoin value onto IOTA as iBTC (the first native Bitcoin asset in the IOTA ecosystem), secured by a committee-based custody model with rate limiting and multi-sig treasury.',
  urls: [
    { label: 'Audit (Hacken)', href: 'https://hacken.io/audits/echo-protocol/sca-echo-protocol-bridge-iota-jul2025/' },
  ],
  teamId: 'echo-protocol',
  disclaimer: 'iBTC is the first bridged asset minted by this bridge; Echo Protocol may add more assets to the same bridge package.',
  match: { all: ['bridge', 'committee', 'ibtc', 'treasury'] },
  attribution: `
On-chain evidence: Move package with modules \`bridge\`, \`committee\`, \`ibtc\`, and \`treasury\` (4 of the 9 modules in Echo Protocol's audited bridge package — \`bridge, chain_ids, committee, crypto, ibtc, limiter, message, message_types, treasury\`). Tightened from the previous 2-module rule to the 4-module subset for extra specificity; the 4-module intersection is still effectively unique on IOTA.

Five upgrade versions on mainnet under deployer \`0x95ec…281e\`. Hacken audit (Jul–Aug 2025) explicitly names Echo Protocol as the customer and lists the exact same 9 modules in scope. Previously labeled "iBTC Bridge" — renamed to reflect the actual product owner (Echo Protocol) rather than the first asset it mints.
`.trim(),
};
```

### 3.3. Aggregator + registry updates

Four files, all a straight symbol rename (`ibtc` → `echoProtocol`,
`ibtcBridge` → `echoProtocolBridge`) in imports, exports, and array
entries:

- `api/src/ecosystem/teams/bridges/_index.ts` —
  `export { ibtc } from './ibtc'` →
  `export { echoProtocol } from './echo-protocol'`.
- `api/src/ecosystem/projects/bridges/_index.ts` —
  `export { ibtcBridge } from './ibtc-bridge'` →
  `export { echoProtocolBridge } from './echo-protocol-bridge'`.
- `api/src/ecosystem/teams/index.ts` — `ibtc` → `echoProtocol` in both
  the `from './bridges/_index'` import and the `// Bridges` array line.
- `api/src/ecosystem/projects/index.ts` — `ibtcBridge` →
  `echoProtocolBridge` in both the import and the `// Bridges` array line.

### 3.4. File renames

- `api/src/ecosystem/teams/bridges/ibtc.ts` →
  `api/src/ecosystem/teams/bridges/echo-protocol.ts`
- `api/src/ecosystem/projects/bridges/ibtc-bridge.ts` →
  `api/src/ecosystem/projects/bridges/echo-protocol-bridge.ts`

---

## 4. Bolt Protocol → Bolt.Earth (rename)

### Context

Module names `station_mount_austin` and `station_nottingham` match the
two pilot locations named in Bolt.Earth's IOTA RealFi press coverage.
Rename from the generic "Bolt Protocol" (which collides with three
unrelated projects on other chains) to the real brand.

### Files touched

- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/teams/misc/bolt-protocol.ts` → rename to `bolt-earth.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/projects/misc/bolt-protocol.ts` → rename to `bolt-earth.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/teams/misc/_index.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/projects/misc/_index.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/teams/index.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/projects/index.ts`

### 4.1. Team `bolt-protocol` → `bolt-earth`

New file `teams/misc/bolt-earth.ts` (replacing `bolt-protocol.ts`):

```ts
import { Team } from '../team.interface';

export const boltEarth: Team = {
  id: 'bolt-earth',
  name: 'Bolt.Earth',
  description: 'India\'s largest EV charging network (founded 2017, Bengaluru; 100,000+ chargers across 1,800+ cities) — tokenizing real-world EV charging stations on IOTA Rebased as part of their RealFi product.',
  urls: [
    { label: 'Website', href: 'https://bolt.earth' },
  ],
  deployers: ['0x1d4ec616351c6be450771d2b291c41579177218da6c5735f2c80af8661f36da3'],
  attribution: `
Single-deployer team. Deployer \`0x1d4e…6da3\` publishes a single 11-module package whose module names include \`station_mount_austin\` and \`station_nottingham\` — the two pilot locations (Mount Austin, Johor Bahru, Malaysia; Nottingham, UK) named in Bolt.Earth's IOTA RealFi press coverage. Supporting modules (\`tokenized_asset\`, \`shares\`, \`unlock\`, \`registry\`, \`station\`, \`bolt\`, \`proxy\`) match the announced RealFi architecture (on-chain shares, NFT ownership, smart-contract-driven yield distribution). Press: cryptonews.net/news/altcoins/31874237, mexc.co/news/501685. Previously labeled "Bolt Protocol" — renamed to disambiguate from three unrelated "Bolt Protocol" projects on other chains.
`.trim(),
};
```

### 4.2. Project `Bolt Protocol` → `Bolt.Earth RealFi`

New file `projects/misc/bolt-earth.ts` (replacing `bolt-protocol.ts`):

```ts
import { ProjectDefinition } from '../project.interface';

export const boltEarth: ProjectDefinition = {
  name: 'Bolt.Earth RealFi',
  layer: 'L1',
  category: 'DePIN / RWA',
  description: 'On-chain tokenization of Bolt.Earth EV charging stations on IOTA Rebased. Each physical charging station is registered and tokenized as on-chain shares with NFT-represented ownership and smart-contract-automated yield distribution. Current pilots: Mount Austin (Johor Bahru, Malaysia) and Nottingham (UK).',
  urls: [
    { label: 'Bolt.Earth', href: 'https://bolt.earth' },
  ],
  teamId: 'bolt-earth',
  match: { all: ['bolt', 'station'] },
  attribution: `
On-chain evidence: Move package with modules \`bolt\` and \`station\` — rule is kept as-is (catches 1/1 on-chain package). The decisive attribution signal is that the package's 11-module set includes \`station_mount_austin\` and \`station_nottingham\`, matching the two pilot locations named in Bolt.Earth's IOTA RealFi press coverage (cryptonews.net, mexc.co). Supporting modules \`tokenized_asset\`, \`shares\`, \`unlock\` match the RealFi architecture as described.

Previously labeled "Bolt Protocol" with category "Protocol" — both were placeholder labels from before the brand was identified. The "Protocol" category is actively misleading here: the product tokenizes real-world infrastructure, so DePIN / RWA is accurate.
`.trim(),
};
```

### 4.3. Aggregator + registry updates (combined with izipublish in section 5)

The `misc/` aggregators and both top-level registry files carry the
`boltProtocol` *and* `easyPublish` identifiers side-by-side, so one
coordinated edit per file covers both renames (Bolt.Earth here + izipublish
in section 5). All four files need the same kind of change: replace
`easyPublish` → `izipublish` and `boltProtocol` → `boltEarth` in imports,
export lists, and array entries.

`api/src/ecosystem/teams/misc/_index.ts` — rename two exports:

```ts
// before
export { easyPublish } from './easy-publish';
...
export { boltProtocol } from './bolt-protocol';
// after
export { izipublish } from './izipublish';
...
export { boltEarth } from './bolt-earth';
```

`api/src/ecosystem/projects/misc/_index.ts` — same pattern:

```ts
// before
export { easyPublish } from './easy-publish';
...
export { boltProtocol } from './bolt-protocol';
// after
export { izipublish } from './izipublish';
...
export { boltEarth } from './bolt-earth';
```

`api/src/ecosystem/teams/index.ts`:

```ts
// before
import { ifTesting, iotaFoundation, studioB8b1, studio0a0d, easyPublish, pointsSystem, boltProtocol, stakingGeneric } from './misc/_index';
...
  easyPublish, pointsSystem, boltProtocol, stakingGeneric,
// after
import { ifTesting, iotaFoundation, studioB8b1, studio0a0d, izipublish, pointsSystem, boltEarth, stakingGeneric } from './misc/_index';
...
  izipublish, pointsSystem, boltEarth, stakingGeneric,
```

`api/src/ecosystem/projects/index.ts`:

```ts
// before
import { marketplaceEscrow, vault, tokenSale, easyPublish, giftDrop, pointsSystem, boltProtocol, staking, nativeStaking, iotaFramework, ifTesting } from './misc/_index';
...
  marketplaceEscrow, vault, tokenSale, easyPublish,
  giftDrop, pointsSystem, boltProtocol, staking,
// after
import { marketplaceEscrow, vault, tokenSale, izipublish, giftDrop, pointsSystem, boltEarth, staking, nativeStaking, iotaFramework, ifTesting } from './misc/_index';
...
  marketplaceEscrow, vault, tokenSale, izipublish,
  giftDrop, pointsSystem, boltEarth, staking,
```

### 4.4. File renames

- `api/src/ecosystem/teams/misc/bolt-protocol.ts` →
  `api/src/ecosystem/teams/misc/bolt-earth.ts`
- `api/src/ecosystem/projects/misc/bolt-protocol.ts` →
  `api/src/ecosystem/projects/misc/bolt-earth.ts`

---

## 5. Easy Publish → izipublish (rename + description rewrite + extra deployer)

### Context

Live DataItem objects on the `easy_publish` package contain
`cars.izipublish.com` as a publish target. The product is
**izipublish**, an on-chain data-publishing dApp — not a Move-package
publishing CLI helper (the current description is wrong). A second
address `0x7c33d09b…0af429` creates Containers/DataItems and belongs
to the same team.

### Files touched

- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/teams/misc/easy-publish.ts` → rename to `izipublish.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/projects/misc/easy-publish.ts` → rename to `izipublish.ts`
- `teams/misc/_index.ts`, `projects/misc/_index.ts`, `teams/index.ts`, `projects/index.ts` — see section 4.3 above (combined)

### 5.1. Team `easy-publish` → `izipublish`

New file `teams/misc/izipublish.ts` (replacing `easy-publish.ts`):

```ts
import { Team } from '../team.interface';

export const izipublish: Team = {
  id: 'izipublish',
  name: 'izipublish',
  description: 'On-chain Data Publishing dApp on IOTA Rebased — hierarchical Containers, versioned DataItems, multi-owner permissions, publish-to-external-domain flow. Live demo at cars.izipublish.com for automotive maintenance records.',
  urls: [
    { label: 'Website', href: 'https://izipublish.com' },
    { label: 'Cars demo', href: 'https://cars.izipublish.com' },
  ],
  deployers: [
    '0x0dce85b04ae7d67de5c6785f329aac1c429cd9321724d64ba5961d347575db97',
    '0x7c33d09b7b6ddbfed32bd945caae96719ae07f68863d8614c4d96d6d320af429',
  ],
  attribution: `
Framework deployer \`0x0dce85…db97\` publishes five upgrade versions of the \`easy_publish\` Move package. Second address \`0x7c33d09b…0af429\` is the **publisher / container creator** — it calls the framework's public entry points to create Containers ("Genesis Container 1") and publish DataItems. Live DataItem \`content\` fields on the middle package version (\`0xb0927f14…\`) contain the JSON \`{"easy_publish":{"publish":{"targets":[{"domain":"cars.izipublish.com",...}]}}}\`, literally naming cars.izipublish.com as the publish target — which resolves to a live IOTA Data Publishing dApp subdomain. Parent site izipublish.com has title "IOTA Data Publishing dApp | On-Chain Data & Verification". The Move package name \`easy_publish\` was the literal brand tagline; the product name is izipublish.
`.trim(),
};
```

### 5.2. Project `Easy Publish` → `izipublish`

New file `projects/misc/izipublish.ts` (replacing `easy-publish.ts`):

```ts
import { ProjectDefinition } from '../project.interface';

export const izipublish: ProjectDefinition = {
  name: 'izipublish',
  layer: 'L1',
  category: 'Data / Publishing',
  description: 'On-chain data-publishing framework on IOTA Rebased powering the izipublish dApp. Provides hierarchical Containers, versioned DataItems, multi-owner permissions, and a publish-to-external-domain flow. Live demo at cars.izipublish.com publishes car-maintenance records on-chain. Small-scale pilot usage today (3 Containers, 3 DataItems).',
  urls: [
    { label: 'Website', href: 'https://izipublish.com' },
    { label: 'Cars demo', href: 'https://cars.izipublish.com' },
  ],
  teamId: 'izipublish',
  match: { all: ['easy_publish'] },
  attribution: `
On-chain evidence: Move package with module \`easy_publish\` (only one deployer on IOTA mainnet ships this module name).

The framework is the Move backend for the izipublish.com Data Publishing dApp. DataItem content fields observed on-chain literally name cars.izipublish.com as the publish target. Previously labeled "Easy Publish" with description "Simplified Move package publishing tool" — that was wrong. Module introspection shows 19 functions and 20 structs (\`Container\`, \`DataItem\`, \`ContainerAudit\`, \`DataItemPublishedEvent\`, etc.) forming a content-management framework, not a CLI helper. The Move module name "easy_publish" was the literal product tagline — the public brand is izipublish.
`.trim(),
};
```

### 5.3. Aggregator + registry updates

See section 4.3 — the same four files carry both renames.

### 5.4. File renames

- `api/src/ecosystem/teams/misc/easy-publish.ts` →
  `api/src/ecosystem/teams/misc/izipublish.ts`
- `api/src/ecosystem/projects/misc/easy-publish.ts` →
  `api/src/ecosystem/projects/misc/izipublish.ts`

---

## 6. Gambling → IOTA Flip (rename)

### Context

Product identified as **IOTA Flip** (iotaflip.netlify.app) — module
struct names `IotaFlipHouse` and `IotaFlipRouletteHouse` embed the
brand directly. Rename team/project from the generic "Gambling" and
"IOTA Flip / Roulette" to the actual brand. Roulette is a game, not
part of the brand name.

Scope of this rename: team + project rename only. The raffle-package
capture (currently uncaptured) is a registry-expansion task handled
elsewhere; not in this thread's remit.

### Files touched

- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/teams/games/gambling.ts` → rename to `iota-flip.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/projects/games/gambling.ts` → rename to `iota-flip.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/teams/games/_index.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/projects/games/_index.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/teams/index.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/projects/index.ts`

### 6.1. Team `gambling` → `iota-flip`

New file `teams/games/iota-flip.ts` (replacing `gambling.ts`):

```ts
import { Team } from '../team.interface';

export const iotaFlip: Team = {
  id: 'iota-flip',
  name: 'IOTA Flip',
  description: 'On-chain gambling suite on IOTA Rebased — coin flip + roulette + raffle games with a wallet-connect UI at iotaflip.netlify.app. Max 1,000 IOTA per bet. Anonymous operator; no publicly identified team.',
  urls: [
    { label: 'App', href: 'https://iotaflip.netlify.app' },
  ],
  deployers: ['0xbe95685023788ea57c6633564eab3fb919847ecd1234448e38e8951fbd4b6654'],
  attribution: `
Single-deployer team. Deployer \`0xbe95…6654\` publishes four upgrade versions of a \`{iota_flip, roulette}\` game package plus one standalone \`raffle\` package. Module struct names (\`IotaFlipHouse\`, \`IotaFlipRouletteHouse\`) embed the brand "IotaFlip" directly in the type identifier — confirming both games ship under a unified IOTA Flip brand. Web front-end at iotaflip.netlify.app runs the coin-flip + roulette product. Anonymous operator (Netlify free-tier hosting, no audit, no whitepaper); attribution is at the product level only.
`.trim(),
};
```

### 6.2. Project `Gambling` → `IOTA Flip`

New file `projects/games/iota-flip.ts` (replacing `gambling.ts`):

```ts
import { ProjectDefinition } from '../project.interface';

export const iotaFlip: ProjectDefinition = {
  name: 'IOTA Flip',
  layer: 'L1',
  category: 'Gambling',
  description: 'On-chain coin flip and roulette games on IOTA Rebased with a wallet-connect front-end at iotaflip.netlify.app. Uses on-chain randomness for outcomes; max 1,000 IOTA per bet. Module struct names (IotaFlipHouse, IotaFlipRouletteHouse) embed the IOTA Flip brand.',
  urls: [
    { label: 'App', href: 'https://iotaflip.netlify.app' },
  ],
  teamId: 'iota-flip',
  match: { all: ['iota_flip', 'roulette'] },
  attribution: `
On-chain evidence: Move package with both \`iota_flip\` and \`roulette\` modules. Matches 4 of 5 IOTA Flip packages (the four game upgrade versions). The standalone \`raffle\` package is currently uncaptured — to be addressed in a separate registry-expansion pass.

Previously labeled "Gambling" (generic) — renamed to the actual product brand (IOTA Flip / iotaflip.netlify.app). Dropped the "/ Roulette" suffix from the team name because roulette is one of several games this project ships, not part of the brand.
`.trim(),
};
```

### 6.3. Aggregator + registry updates

Straight symbol rename `gambling` → `iotaFlip` in:

- `api/src/ecosystem/teams/games/_index.ts` (the sole export).
- `api/src/ecosystem/projects/games/_index.ts` (the last of four
  exports).
- `api/src/ecosystem/teams/index.ts` — import + `// Games` array line.
- `api/src/ecosystem/projects/index.ts` — import + `// Games` array line.

### 6.4. File renames

- `api/src/ecosystem/teams/games/gambling.ts` →
  `api/src/ecosystem/teams/games/iota-flip.ts`
- `api/src/ecosystem/projects/games/gambling.ts` →
  `api/src/ecosystem/projects/games/iota-flip.ts`

---

## 7. TLIP — promote from `if-tlip` to standalone `tlip`

### Context

TLIP already sits outside the consolidated `iota-foundation` team
because it has its own brand (tlip.io, TradeMark East Africa partnership,
wiki.tlip.io, `tmea-tlip` GitHub org). The `if-tlip` id is a vestige of
the old per-IF-product team layout. Promote to a plain `tlip` team with
a description that surfaces the TMEA partnership.

### Files touched

- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/teams/trade/if-tlip.ts` → rename to `tlip.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/projects/trade/tlip.ts` (edit in place)
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/teams/trade/_index.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/src/ecosystem/teams/index.ts`
- `/home/ralf/PhpstormProjects/iota-trade-scanner/api/test/ecosystem.functional-spec.ts` (test fixture references `if-tlip`)

### 7.1. Team `if-tlip` → `tlip`

New file `teams/trade/tlip.ts` (replacing `if-tlip.ts`):

```ts
import { Team } from '../team.interface';

export const tlip: Team = {
  id: 'tlip',
  name: 'TLIP',
  description: 'Trade and Logistics Information Pipeline — an IOTA Foundation + TradeMark East Africa (TMEA) partnership for digital trade documents (electronic Bills of Lading, Certificates of Origin, Commercial Invoices).',
  urls: [
    { label: 'Website', href: 'https://www.tlip.io' },
    { label: 'Wiki', href: 'https://wiki.tlip.io' },
    { label: 'Partner (TMEA)', href: 'https://trademarkafrica.com/projects/trade-logistics-information-pipeline-tlip/' },
  ],
  deployers: ['0xd7e2de659109e51191f733479891c5a2e1e46476ab4bafe1f663755f145d5176'],
  logo: '/logos/tlip.svg',
  attribution: `
Deployer \`0xd7e2…5176\` publishes the sole TLIP package (\`0xdeadee97…e108\`, vanity prefix) with modules \`carrier_registry, ebl, endorsement, interop_control, notarization\` — textbook TLIP architecture per wiki.tlip.io. TLIP is a flagship IOTA Foundation + TradeMark East Africa (TMEA) partnership, documented at tlip.io, blog.iota.org/tlip-website, trademarkafrica.com/projects/trade-logistics-information-pipeline-tlip, and the IOTA-hosted showcase PDF at files.iota.org/comms/TLIP_IOTA_Showcase_Presentation.pdf. Kept as a standalone team rather than folded into \`iota-foundation\` because TLIP has its own brand footprint (own domain, own wiki, own GitHub org \`tmea-tlip\`, own Medium publication) independent of the IF. The team id was previously \`if-tlip\`; promoted to \`tlip\` to match how the project publicly presents itself.
`.trim(),
};
```

### 7.2. Project `TLIP (Trade)` → `TLIP`

Edit `projects/trade/tlip.ts` in place (filename is already `tlip.ts`).
Change `name`, `description`, `urls`, `teamId`, and `attribution`
(`layer`, `category`, `match` unchanged):

```ts
name: 'TLIP',
description: 'Trade and Logistics Information Pipeline — an IOTA Foundation + TradeMark East Africa (TMEA) partnership for digital trade documents. Handles electronic Bills of Lading (eBL), carrier registries, and endorsement chains for cross-border shipments. Deployed in Kenya/Ghana/Rwanda ADAPT corridors.',
urls: [
  { label: 'Website', href: 'https://www.tlip.io' },
  { label: 'Wiki', href: 'https://wiki.tlip.io' },
  { label: 'IOTA Foundation', href: 'https://www.iota.org/solutions/trade' },
],
teamId: 'tlip',
attribution: `
On-chain evidence:
- Hardcoded package address \`0xdeadee97…e108\` (vanity prefix signals institutional deploy).
- Package also contains a module named \`ebl\` (electronic Bill of Lading — TLIP's core primitive). No other IOTA deployer ships an \`ebl\` module, so the module match is a safe fallback if TLIP redeploys at a new address.

TLIP is an IOTA Foundation + TradeMark East Africa (TMEA) partnership for digitizing cross-border trade documents. Previously named "TLIP (Trade)" with teamId \`if-tlip\`; renamed to "TLIP" / \`tlip\` now that it's the sole surviving standalone IF-spinout team (the other IF-subproduct teams were consolidated into \`iota-foundation\` earlier).
`.trim(),
```

### 7.3. Aggregator + registry updates

- `api/src/ecosystem/teams/trade/_index.ts` —
  `export { ifTlip } from './if-tlip'` →
  `export { tlip } from './tlip'`.
- `api/src/ecosystem/teams/index.ts` —
  `import { ifTlip, salus } from './trade/_index'` →
  `import { tlip as tlipTeam, salus } from './trade/_index'`, and
  `ifTlip, salus,` in the array → `tlipTeam, salus,`.

The `tlip as tlipTeam` alias in `teams/index.ts` is cosmetic — there is
no actual symbol clash because the project-level `tlip` lives in a
separate file — but it makes the file easier to scan. If the reviewer
prefers to keep the symbol named `tlip`, that works too.

### 7.4. Test fixture update

`api/test/ecosystem.functional-spec.ts` — three occurrences of
`'if-tlip'` need to become `'tlip'`, and the name
`'IOTA Foundation (TLIP)'` becomes `'TLIP'`:

before:
```ts
          team: { id: 'if-tlip', name: 'IOTA Foundation (TLIP)' },
...
      const tlipTeam = res.body.find((t: any) => t.id === 'if-tlip');
...
        .get('/ecosystem/teams/if-tlip')
        .expect(200);
      expect(res.body.id).toBe('if-tlip');
```

after:
```ts
          team: { id: 'tlip', name: 'TLIP' },
...
      const tlipTeam = res.body.find((t: any) => t.id === 'tlip');
...
        .get('/ecosystem/teams/tlip')
        .expect(200);
      expect(res.body.id).toBe('tlip');
```

Also the fixture's project `name: 'TLIP (Trade)'` reference on line 91
(`{ slug: 'aa-tlip-trade', name: 'TLIP (Trade)', ...`) and line 118
(`expect(res.body.name).toBe('TLIP (Trade)')`) should be updated to
`'TLIP'` to match the new project name — these are independent of the
team-id change but live in the same file.

### 7.5. File renames

- `api/src/ecosystem/teams/trade/if-tlip.ts` →
  `api/src/ecosystem/teams/trade/tlip.ts`

No project-file rename needed (`projects/trade/tlip.ts` already has
the right filename).

---

## Execution sequence

Apply the patches in this order so the tree is compilable at every
checkpoint. Each numbered step ends with `cd api && npx tsc --noEmit &&
npx jest && npx jest --config test/jest-functional.config.js`.

**Step 1 — Virtue misattribution + dead-def cleanup**
1. Edit `teams/defi/virtue.ts` (drop CyberPerp deployer + refresh prose).
2. Edit `projects/defi/virtue.ts` — rewrite `virtue` match to
   `packageAddresses: [...]`, rename `virtuePool` →
   `virtueStabilityPool`, remove `virtueStability`.
3. Edit `projects/defi/_index.ts` — update re-exports.
4. Edit `projects/index.ts` — update import line + `// DeFi` array.

**Step 2 — Swirl Validator dead-def**
1. Edit `projects/defi/swirl.ts` — remove `swirlValidator` export.
2. `projects/defi/_index.ts` + `projects/index.ts` — already updated
   in Step 1.

**Step 3 — iBTC → Echo Protocol rename**
1. `git mv teams/bridges/ibtc.ts teams/bridges/echo-protocol.ts` and
   rewrite the export (`ibtc` → `echoProtocol`).
2. `git mv projects/bridges/ibtc-bridge.ts
   projects/bridges/echo-protocol-bridge.ts` and rewrite the export
   (`ibtcBridge` → `echoProtocolBridge`, tighten match, update teamId).
3. Edit `teams/bridges/_index.ts`, `projects/bridges/_index.ts`,
   `teams/index.ts`, `projects/index.ts` — rename the imports and
   array entries.

**Step 4 — Bolt Protocol → Bolt.Earth rename**
1. `git mv teams/misc/bolt-protocol.ts teams/misc/bolt-earth.ts` and
   rewrite the export.
2. `git mv projects/misc/bolt-protocol.ts projects/misc/bolt-earth.ts`
   and rewrite the export (new name, category DePIN/RWA, teamId
   `bolt-earth`).
3. The four `misc/` aggregator + top-level registry edits are shared
   with Step 5 — do them in one coordinated change if bundled into the
   same commit; otherwise each per-step edit must still leave the rest
   of the `misc/` list intact (which it does).

**Step 5 — Easy Publish → izipublish rename**
1. `git mv teams/misc/easy-publish.ts teams/misc/izipublish.ts` and
   rewrite the export (add second deployer `0x7c33d09b…0af429`).
2. `git mv projects/misc/easy-publish.ts projects/misc/izipublish.ts`
   and rewrite the export (correct description, category
   `Data / Publishing`).
3. Finish the aggregator edits shared with Step 4 (see section 4.3).

**Step 6 — Gambling → IOTA Flip rename**
1. `git mv teams/games/gambling.ts teams/games/iota-flip.ts` and
   rewrite the export.
2. `git mv projects/games/gambling.ts projects/games/iota-flip.ts` and
   rewrite the export.
3. Edit `teams/games/_index.ts`, `projects/games/_index.ts`,
   `teams/index.ts`, `projects/index.ts` — rename symbol.

**Step 7 — TLIP promotion**
1. `git mv teams/trade/if-tlip.ts teams/trade/tlip.ts` and rewrite the
   export (`ifTlip` → `tlip`, id/name/description/urls/attribution).
2. Edit `projects/trade/tlip.ts` in place — name, description, teamId
   `'tlip'`, attribution.
3. Edit `teams/trade/_index.ts` — `ifTlip` → `tlip`.
4. Edit `teams/index.ts` — import (alias `tlip as tlipTeam` optional)
   + `// Trade` array entry.
5. Edit `api/test/ecosystem.functional-spec.ts` — three `'if-tlip'`
   → `'tlip'`, one `'IOTA Foundation (TLIP)'` → `'TLIP'`, two
   `'TLIP (Trade)'` → `'TLIP'`.

### Final checks

- `cd api && npx tsc --noEmit` — zero TS errors.
- `cd api && npx jest` — all unit specs pass.
- `cd api && npx jest --config test/jest-functional.config.js` — all
  functional specs pass.
- `cd api && npx eslint src/` — no lint errors.
- `cd website && npm run test:unit` — if any website spec hardcodes a
  team id or project name touched above, update it. (None found in the
  current grep.)
- Deploy + recapture so the ecosystem snapshot reflects the new
  attributions; verify the live `/ecosystem` endpoint no longer
  contains entries for `ibtc`, `bolt-protocol`, `easy-publish`,
  `gambling`, `if-tlip`, `virtue-stability`, or `swirl-validator`.

### Cross-thread dependencies

- **Virtue misattribution fix frees up `0x14ef…c3e0`** for the
  CyberPerp L1 new-team thread (handled separately). Ordering: Virtue
  fix must land before CyberPerp add, otherwise the CyberPerp packages
  would still be claimed by Virtue's rule.
- **izipublish adds a publisher deployer** `0x7c33d09b…0af429`. Make
  sure no other team/project lists that address; a quick grep confirms
  it doesn't appear elsewhere in the current registry.
- **TLIP id change** from `if-tlip` to `tlip` is a breaking URL change
  for the `/team/if-tlip` route. The functional-spec update handles the
  API test, but the live site will return 404 on the old URL until the
  recapture runs. Low user impact (team pages aren't widely linked),
  but worth noting in the deploy announcement.

### Out of scope for this thread

- IOTA Flip raffle package capture (new project def for the standalone
  `raffle` package) — registry-expansion territory.
- Adding the CyberPerp L1 team/projects — separate thread.
- Tightening the Virtue match rule to auto-discover upgrade versions
  of each of the 5 canonical addresses — the current hardcoded-address
  rule will miss upgrades. Deferred; if Virtue redeploys any of the
  five components, we'll see it as an anomaly-log entry and can widen
  the rule then.
- Virtue's Stability Pool Incentive packages (module set `{borrow_incentive,
  stability_pool_incentive, ...}`) remain uncaptured after the
  `virtueStability` removal. A replacement def with a proper match rule
  (e.g. `{all: ['stability_pool_incentive', 'borrow_incentive']}`) can
  be authored later; out of scope here because it's a new rule, not a
  correction of an existing one.
