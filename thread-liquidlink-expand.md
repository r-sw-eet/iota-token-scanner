# LiquidLink — team rename + registry expansion

## Goal

Apply two correlated registry changes:

1. Rename team `points-system` → `liquidlink` (reflects the verified
   real-world brand — `handoff.md` → "Points System → LiquidLink
   [x] VERIFIED").
2. Capture all 11 LiquidLink packages on mainnet (current rule catches
   only 4 of 11; 7 are uncaptured).

This thread drafts the paste-ready `.ts` files and registry-index
diffs. No changes to `api/src/` here — application happens in the
big coordinated correction pass described in `threads.md` → Meta-
thread.

## On-chain inventory (all 11 packages)

Enumerated on 2026-04-17. The deployer
`0xd6a54ff7f851b58c19729c11d210d46fd46d702b9d9caff78747de1914c934ee`
was scanned via `transactionBlocks(filter: { sentAddress })` for
`PROGRAMMABLE_TX` blocks (2050 txns walked — produced 8 packages). The
remaining 3 profile-layer packages were found by scanning every mainnet
package (`packages(first: 50)` paginated) and filtering on modules
containing `iota_liquidlink_profile`. All 11 packages confirm the same
deployer.

### Single deployer — `0xd6a54ff7f851b58c19729c11d210d46fd46d702b9d9caff78747de1914c934ee` (11 packages)

| Package address                                                      | Modules                           | Cohort                     |
|----------------------------------------------------------------------|-----------------------------------|----------------------------|
| `0x12fc1744dbd2401a0bbc1cb07995e1d7b2d9179a42a90ae7311e4c477112bf83` | `constant, event, point, profile` | Points v1                  |
| `0x249dd22d5d65bd74d1427061620a3b4143e6c61b21375d841761eb71630ea1ff` | `constant, event, point, profile` | Points v1                  |
| `0xcc62dc17ff55d0e434bdec1dce0a7127f891ca76808a63348cc46a9d50f41c20` | `constant, event, point, profile` | Points v1                  |
| `0x2ecd5a5ddfeaf9f73174fc5459ba2289d4ef4bd2bd966b0ed548b4661f27140f` | `constant, event, point, profile` | Points v1 (latest upgrade) |
| `0x4d62811016a2e0a3a44adcdaaf1f8fc46aa2e807ccb208dfb4cb00642a668b2a` | `core, events`                    | Points v2                  |
| `0x4d0f83803033da5fdb5728335bed0557405d1f28ffc832714363df47361dbeed` | `core, events`                    | Points v2                  |
| `0x6d0efef88d35ae63bdc7ca4b32e8611ecde34841dacbd3c00df1ee4825774ab8` | `utils`                           | Utils                      |
| `0xf9fa275e30f07d3155e75441b7a50e795758627455c2fa714c2285045de3b973` | `utils`                           | Utils                      |
| `0xc6b5757021d52e8159f3435663080848bc47dec3679fbe202642774ba4748d2d` | `iota_liquidlink_profile`         | Profile (standalone)       |
| `0x483fc768193b53bff2699be95911342378e3c2cf2233a9f49d21144a67b027fb` | `iota_liquidlink_profile, like`   | Profile + social           |
| `0xc2d7763307bbaf1a0d327c06b516c780c1831d996515e5a8e21203c1e071121f` | `iota_liquidlink_profile, like`   | Profile + social (latest)  |

### Module-signature matrix

| Signature                           | Count | Covered by current rule `{exact: ['constant', 'event', 'point', 'profile']}`? |
|-------------------------------------|-------|-------------------------------------------------------------------------------|
| `{constant, event, point, profile}` | 4     | Yes                                                                           |
| `{core, events}`                    | 2     | No                                                                            |
| `{utils}`                           | 2     | No                                                                            |
| `{iota_liquidlink_profile}`         | 1     | No                                                                            |
| `{iota_liquidlink_profile, like}`   | 2     | No                                                                            |

Current coverage: 4 of 11. Missing: 7.

### Brand-embedding module — irrefutable attribution

The `iota_liquidlink_profile` module name literally embeds the brand.
Scanned all 747 mainnet packages; exactly three publish a module with
that name, all from this deployer. No other address on IOTA mainnet
ships anything `liquidlink`-named. Combined with the Zokyo-audit-style
gold standard (public site + press + matching on-chain evolution
cadence), the deployer-to-brand mapping is conclusive.

## Recommendation

**Single umbrella project `LiquidLink` matching all 11 packages via
`packageAddresses`.** Rationale:

- LiquidLink markets itself as one product ("Modular On-Chain
  Incentive Infrastructure"). Splitting into Points v1 / Points v2 /
  Profile would fragment the story for site visitors who expect one
  row for one brand.
- The v2 `{core, events}` signature is generic and will false-match
  other teams if we try to cover it by module names alone. Hardcoding
  the 11 addresses makes the rule trivially safe.
- The `{utils}` signature is the *definition* of generic and cannot
  be rule-matched without false positives — forces `packageAddresses`
  regardless.
- Following `tlip.ts` style, we can still add an `all: ['point']` or
  `any: ['iota_liquidlink_profile']` sanity-check on top of
  `packageAddresses` — but with 11 mixed signatures it's simpler to
  just list the addresses.

If we ever want per-cohort breakdown later, we can split into
`LiquidLink Points`, `LiquidLink Profile`, etc. without losing data
(the deployer→team mapping stays). But ship one row first.

Category: **`Incentive / Social`** — matches LiquidLink's own
positioning ("on-chain incentive infrastructure") and captures the
social-profile evolution better than `Loyalty` or
`DeFi Infrastructure`.

## Team rename draft

New file `api/src/ecosystem/teams/misc/liquidlink.ts` (replaces
`points-system.ts`):

```ts
import { Team } from '../team.interface';

export const liquidlink: Team = {
  id: 'liquidlink',
  name: 'LiquidLink',
  description: 'Modular on-chain incentive infrastructure — points engine, profile NFTs, referrals, and social engagement. Deployed on both IOTA and Sui mainnet with integrations to Bucket Protocol and Strater on the Sui side.',
  urls: [
    { label: 'Website', href: 'https://www.liquidlink.io' },
    { label: 'IOTA App', href: 'https://iota.liquidlink.io' },
    { label: 'X', href: 'https://x.com/Liquidlink_io' },
  ],
  deployers: ['0xd6a54ff7f851b58c19729c11d210d46fd46d702b9d9caff78747de1914c934ee'],
  attribution: `
Single-deployer team. Attribution rests on a brand-embedded module name: the latest package at this deployer (\`0xc2d77633…1121f\`) publishes a module literally called \`iota_liquidlink_profile\`. Scanning all 747 mainnet packages confirms no other address ships anything \`liquidlink\`-named.

LiquidLink markets on [liquidlink.io](https://www.liquidlink.io) as "Modular On-Chain Incentive Infrastructure" running on IOTA and Sui mainnet, with a dedicated IOTA app at [iota.liquidlink.io](https://iota.liquidlink.io) and public X presence [@Liquidlink_io](https://x.com/Liquidlink_io). The on-chain product evolution visible at this deployer — a 4-module points engine (\`{constant, event, point, profile}\`), refactored to \`{core, events}\` v2, then a profile NFT layer (\`iota_liquidlink_profile\`) with a \`like\` social primitive layered on — matches LiquidLink's published roadmap (launch with points; add social profile + engagement).

Previously labelled "Points System" in this registry as a purely descriptive placeholder before the brand was identified.
`.trim(),
};
```

## Project defs draft

New file `api/src/ecosystem/projects/misc/liquidlink.ts` (replaces
`points-system.ts`):

```ts
import { ProjectDefinition } from '../project.interface';

export const liquidlink: ProjectDefinition = {
  name: 'LiquidLink',
  layer: 'L1',
  category: 'Incentive / Social',
  description: 'Modular on-chain incentive infrastructure. Ships a points engine (v1 `{constant, event, point, profile}`, v2 `{core, events}`), a profile NFT with editable image/text metadata, and a social engagement primitive (`like` tracker). Multi-chain deployment (IOTA + Sui mainnet) with integrations to Bucket Protocol and Strater on Sui.',
  urls: [
    { label: 'Website', href: 'https://www.liquidlink.io' },
    { label: 'IOTA App', href: 'https://iota.liquidlink.io' },
  ],
  teamId: 'liquidlink',
  match: {
    packageAddresses: [
      // Points v1 — {constant, event, point, profile}
      '0x12fc1744dbd2401a0bbc1cb07995e1d7b2d9179a42a90ae7311e4c477112bf83',
      '0x249dd22d5d65bd74d1427061620a3b4143e6c61b21375d841761eb71630ea1ff',
      '0xcc62dc17ff55d0e434bdec1dce0a7127f891ca76808a63348cc46a9d50f41c20',
      '0x2ecd5a5ddfeaf9f73174fc5459ba2289d4ef4bd2bd966b0ed548b4661f27140f',
      // Points v2 — {core, events}
      '0x4d62811016a2e0a3a44adcdaaf1f8fc46aa2e807ccb208dfb4cb00642a668b2a',
      '0x4d0f83803033da5fdb5728335bed0557405d1f28ffc832714363df47361dbeed',
      // Shared utils
      '0x6d0efef88d35ae63bdc7ca4b32e8611ecde34841dacbd3c00df1ee4825774ab8',
      '0xf9fa275e30f07d3155e75441b7a50e795758627455c2fa714c2285045de3b973',
      // Profile + social
      '0xc6b5757021d52e8159f3435663080848bc47dec3679fbe202642774ba4748d2d',
      '0x483fc768193b53bff2699be95911342378e3c2cf2233a9f49d21144a67b027fb',
      '0xc2d7763307bbaf1a0d327c06b516c780c1831d996515e5a8e21203c1e071121f',
    ],
  },
  attribution: `
On-chain evidence: 11 packages hardcoded by address, all published from the single deployer \`0xd6a5…34ee\`.

We hardcode addresses rather than match by module names because LiquidLink's packages span four cohorts with mutually disjoint module sets — Points v1 (\`{constant, event, point, profile}\`), Points v2 (\`{core, events}\`), shared utilities (\`{utils}\`), and the profile + social layer (\`{iota_liquidlink_profile}\`, \`{iota_liquidlink_profile, like}\`). Three of those signatures (v2, utils, and even \`{constant, event, point, profile}\` in isolation) are generic enough that a module-name rule would false-match unrelated teams.

Brand identification is grounded by the \`iota_liquidlink_profile\` module name, which literally embeds the LiquidLink brand and is unique to this deployer across all 747 mainnet packages. Once the deployer is pinned to LiquidLink by that module, every other package published from the same address inherits the attribution.

Rendered as a single umbrella row because LiquidLink markets the points engine, profile NFT, and social layer as one product ("Modular On-Chain Incentive Infrastructure") rather than independently branded SKUs.
`.trim(),
};
```

## Registry-index changes

### `api/src/ecosystem/teams/misc/_index.ts`

```diff
-export { pointsSystem } from './points-system';
+export { liquidlink } from './liquidlink';
```

### `api/src/ecosystem/teams/index.ts`

```diff
-import { ifTesting, iotaFoundation, studioB8b1, studio0a0d, easyPublish, pointsSystem, boltProtocol, stakingGeneric } from './misc/_index';
+import { ifTesting, iotaFoundation, studioB8b1, studio0a0d, easyPublish, liquidlink, boltProtocol, stakingGeneric } from './misc/_index';
```

```diff
   ifTesting,
   studioB8b1, studio0a0d,
-  easyPublish, pointsSystem, boltProtocol, stakingGeneric,
+  easyPublish, liquidlink, boltProtocol, stakingGeneric,
 ];
```

### `api/src/ecosystem/projects/misc/_index.ts`

```diff
-export { pointsSystem } from './points-system';
+export { liquidlink } from './liquidlink';
```

### `api/src/ecosystem/projects/index.ts`

```diff
-import { marketplaceEscrow, vault, tokenSale, easyPublish, giftDrop, pointsSystem, boltProtocol, staking, nativeStaking, iotaFramework, ifTesting } from './misc/_index';
+import { marketplaceEscrow, vault, tokenSale, easyPublish, giftDrop, liquidlink, boltProtocol, staking, nativeStaking, iotaFramework, ifTesting } from './misc/_index';
```

```diff
   // Misc
   marketplaceEscrow, vault, tokenSale, easyPublish,
-  giftDrop, pointsSystem, boltProtocol, staking,
+  giftDrop, liquidlink, boltProtocol, staking,
   nativeStaking, iotaFramework,
   ifTesting,
```

### File operations

- `git mv api/src/ecosystem/teams/misc/points-system.ts api/src/ecosystem/teams/misc/liquidlink.ts`
- `git mv api/src/ecosystem/projects/misc/points-system.ts api/src/ecosystem/projects/misc/liquidlink.ts`
- Rewrite both file contents per the drafts above.

### Optional (follow-up)

- Add `/logos/liquidlink.svg` under `api/src/ecosystem/projects/logos/`
  (the IOTA app favicon / site logomark). Then set `logo:
  '/logos/liquidlink.svg'` on the team and the project will inherit
  it via `Team.logo` precedence (see `website/components/ProjectLogo.vue`).
- No test impact: no spec files reference `pointsSystem` / `points-system`.

## Sanity check after apply

1. `npx tsc --noEmit` inside `api/`.
2. `npx jest` (unit) + `npx jest --config test/jest-functional.config.js`
   inside `api/`.
3. After deploy + recapture, verify
   `/api/v1/ecosystem/teams/liquidlink` returns **11 packages** in
   a single project row named `LiquidLink`. Old
   `/api/v1/ecosystem/teams/points-system` should 404.
