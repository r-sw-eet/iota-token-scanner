# Thread: Pools Finance farming deployer — upgrade attribution

## Goal

Upgrade the Pools Finance farming deployer
`0x21303d10b1369c414f297a6297e48d6bce07bec58f251ea842c7b33779283542`
from 🟡 circumstantial to [x] gold-standard, by finding a published
audit, developer doc, or app-level network capture that names the
specific address as Pools Finance's farming contract deployer.

## What I tried

1. **WebFetch pools.finance / docs.pools.finance subpages**:
   `/farming` (404), `/security` (404), `/protocol-design` (404) on
   the docs host. Root `docs.pools.finance` sidebar + `/using-pools/
   farming` page load, but neither surfaces any on-chain address —
   docs are user-facing and strip technical identifiers.

2. **Medium publication**: listed all 3 articles from
   `medium.com/@Pools_Finance`. Fetched the most relevant,
   `From Swap to Farm: How to Make Your LPs Work Harder in Pools`
   (Aug 2025). **Zero contract / package addresses in the post** —
   article is pure marketing.

3. **GitHub**: re-checked `github.com/Pools-Finance`. Org still has
   `public_repos: 0` (verified via `api.github.com/users/Pools-
   Finance`). The `pools-protocol` repo referenced in the Zokyo AMM
   audit is private. Zokyo's `audit-reports/Pools Finance/` folder
   contains only `Pools_Finance_Zokyo_audit_report_May12_2025.pdf`
   plus an empty placeholder file — **no farming follow-up audit
   exists**.

4. **Hacken audit page** (`hacken.io/audits/pools-finance/`): listed
   as audited by Hacken, but the page I could fetch has no scope or
   module list — just "1 Audit" as a badge with no linked PDF. No
   evidence Hacken covered farming.

5. **`app.pools.finance` static analysis**: downloaded all 38
   Next.js chunks from `app.pools.finance` (the actual app, not the
   docs). Grepped the bundle for every registered Pools Finance
   deployer and every one of the farming deployer's 5 package
   addresses:

   | Address | Appears in app bundle? |
   |---|---|
   | `0x519e…800c` (AMM deployer 1) | [ ] |
   | `0xeada…88e7` (AMM deployer 2) | [ ] |
   | `0xe059cf…5885` (AMM package, audited by Zokyo) | [x] |
   | `0x21303d10…3542` (farming deployer) | **[ ]** |
   | `0x95690908…3ebd2` (v1 farming pkg) | **[ ]** |
   | `0x244e1c75…9e81` (v2 farming pkg) | **[ ]** |
   | `0x32b4e01d…08e2` (v3 farming pkg) | **[ ]** |
   | `0x4de55aebb…d7b5` (v4 farming pkg) | **[ ]** |
   | `0x505d2a52…ada9` (v5 farming pkg) | **[ ]** |

   The app does reference a second AMM package `0xc0d0341970ed92ff…
   c62332` — published by `0x519e…800c` (known Pools Finance AMM
   deployer) — whose modules are: `amm_config, amm_entries, amm_math,
   amm_router, amm_stable_utils, amm_swap, amm_utils, stake,
   stake_config, stake_entries`. **That's the same 10-module set the
   Zokyo audit covered.** Pools Finance's staking / LP-lock lives in
   the `stake*` modules of the audited AMM package, not in a separate
   farming package.

6. **On-chain shape of the `0x21303d10…` deployer**: scanned all
   mainnet packages via GraphQL (packages(first: 50) paging). Five
   packages come from this deployer. All five include an `irt`
   module. I queried CoinMetadata for the coin type
   `0x95690908e995c79033b9d392680cfb43f39fc344e79a6c6845dc23334bb3ebd2::irt::IRT`:

   ```json
   {
     "decimals": 9,
     "name": "IotaRoyale Token",
     "symbol": "IRT",
     "description": "Token nativo de IotaRoyale - Plataforma de juegos PvP en IOTA. Mecanismo deflacionario.",
     "iconUrl": "https://iotaroyale.com/logo.png"
   }
   ```

   The `iotaroyale.com/logo.png` fetched from that URL is a royal-
   lion mascot ("Royale" game branding), not Pools Finance's blue-
   duck branding.

7. **Web search for IotaRoyale**: surfaces `iotaroyale.com`
   ("Juegos de Mesa Competitivos en Blockchain"), a Parchís / table-
   game platform on IOTA with its own `$IRT` reward token and farms
   on Pools Finance's DEX. See YouTube (Feb 22 2026):
   `BOMBA en IOTA: IOTAROYALE lanza su token $IRT y conecta farms
   con $TLN` (`youtube.com/watch?v=6530JLNTqoU`) and GeckoTerminal's
   `IRT/vIOTA - IotaRoyale Token Price on Pools Finance` (
   `geckoterminal.com/iota/pools/0xc3cb4e5156ca635526b22f05e5cc357d7cc7d7d5d0f3338fa15294a772e381b8`).

## What I found

**The farming deployer `0x21303d10…3542` is not Pools Finance. It is
IotaRoyale.**

Chain of evidence:

- The deployer has published exactly five packages on mainnet. All
  five include an `irt` module. IRT's on-chain CoinMetadata
  identifies it unambiguously as IotaRoyale's native token ("Token
  nativo de IotaRoyale … Plataforma de juegos PvP en IOTA"), branded
  with IotaRoyale's logo.
- IotaRoyale's public marketing (YouTube launch video, GeckoTerminal
  product listing) explicitly describes the product as "IRT farms"
  and "TLN farm" — two farms with IRT, one with TLN, matching the
  `farm` + `farm_dual` + `farm_yield` module shape.
- The Pools Finance frontend bundle (38 Next.js chunks from
  `app.pools.finance`) references `0xe059cf…5885` (audited AMM
  package) and `0xc0d0…c62332` (newer AMM package deployed by the
  known Pools deployer `0x519e…800c`) but **zero** references to
  `0x21303d10…`, any of its 5 packages, or the `IRT` coin type.
- Pools Finance's actual staking mechanism lives inside the audited
  AMM package: modules `stake`, `stake_config`, `stake_entries` —
  exactly the names in the Zokyo audit scope. Pools doesn't have a
  separate "farming package" to attribute.
- `0x21303d10…` trades `stIOTA → CERT → TLN` through the Pools Finance
  AMM router (verified from its tx history), which is consistent
  with it being an IotaRoyale operator wallet providing liquidity
  and distributing rewards on Pools Finance pools — a *customer*, not
  the AMM operator.

This is a misattribution in the current registry, not a gap in
attribution rigor.

## Attribution status

**Downgrade, not upgrade.** Goal was "🟡 → [x] for Pools Finance
farming deployer". Actual answer: the deployer is not Pools Finance's
at all — it's IotaRoyale's (`iotaroyale.com`), a separate team that
runs a Parchís/board-games product with farms on top of the Pools
Finance DEX.

### Concrete next steps (for whoever acts on this)

1. **Registry fix** — remove
   `0x21303d10b1369c414f297a6297e48d6bce07bec58f251ea842c7b33779283542`
   from `api/src/ecosystem/teams/defi/pools-finance.ts:11`.
2. **New team + project** — add an `iotaroyale` team (deployer =
   `0x21303d10…`, website `iotaroyale.com`, logo from
   `iotaroyale.com/logo.png`). Category: Gaming / GambleFi. Attribute
   via the IRT CoinMetadata (gold-standard — the on-chain metadata
   itself names IotaRoyale and points at their domain).
3. **Rewrite the "Pools Farming" project def** in
   `api/src/ecosystem/projects/defi/pools-finance.ts:24-43`: drop the
   `{farm, irt}` matcher (that matches IotaRoyale, not Pools). If we
   want a separate "Pools LP staking" row, use a matcher based on
   `{stake_config, stake_entries}` on the AMM deployers.
4. **Register `0xc0d0341970ed92ff0d72f7419b8a812d9a98708dd8078dcc6f9d26c1b9c62332`**
   if our scanner isn't already attributing it — it's a newer Pools
   Finance AMM package the frontend uses, published by the known
   `0x519e…800c` deployer.
5. **Pools Finance team attribution is already [x]** via the Zokyo
   audit for both AMM deployers (handoff.md is correct on that
   point). After the fix above, Pools Finance becomes a 2-deployer
   team, both gold-standard — no circumstantial attribution left.

### Why this wasn't caught earlier

The original reasoning chain ("`irt` module is Pools Finance's
reward-token abbreviation") was a plausible-sounding guess made
without checking the coin metadata or the app bundle. One call to
`iotax_getCoinMetadata` on the IRT type would have answered it in
2025; one grep of the app bundle would have answered it today. Both
are now done and point the same direction.

## Sources

- IRT CoinMetadata on IOTA mainnet RPC (`api.mainnet.iota.cafe`,
  `iotax_getCoinMetadata` for `0x95690908…::irt::IRT`).
- Pools Finance app bundle: `app.pools.finance/_next/static/chunks/*`
  (downloaded 2026-04-17, only matching deployer address is
  `0x519ebf6b…800c`; farming deployer absent).
- Full package scan of mainnet from
  `https://graphql.mainnet.iota.cafe`.
- Zokyo audit (known, cited in handoff.md):
  `github.com/zokyo-sec/audit-reports/blob/main/Pools%20Finance/
  Pools_Finance_Zokyo_audit_report_May12_2025.pdf`.
- GeckoTerminal: `geckoterminal.com/iota/pools/
  0xc3cb4e5156ca635526b22f05e5cc357d7cc7d7d5d0f3338fa15294a772e381b8`
  ("IRT/vIOTA - IotaRoyale Token Price on Pools Finance").
- IotaRoyale website: `iotaroyale.com` (logo and tagline).
- IOTAROYALE launch video (YouTube, Feb 22 2026):
  `youtube.com/watch?v=6530JLNTqoU`.
- GitHub org metadata:
  `api.github.com/users/Pools-Finance` → `public_repos: 0`.
