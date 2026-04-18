# Thread — Studio 0x0a0d4c9a attribution via downstream dependency scan

Date: 2026-04-17. Deployer
`0x0a0d4c9a9f935dac9f9bee55ca0632c187077a04d0dffcc479402f2de9a82140`.

## Goal

Identify the team behind Studio 0a0d's 33-package stealth deployment
(Spec launchpad + Claw token/swap + Aegora-style commerce marketplace)
using **downstream dependency analysis** — find any Move packages
*outside* this deployer whose `linkage` references Studio 0a0d's
packages, which would expose an early integrator and potentially the
team.

## Approach

1. Fetched the 33 packages deployed by Studio 0a0d via the GraphQL
   endpoint `https://graphql.mainnet.iota.cafe`, paginating
   `packages(first: 50)` and filtering by
   `previousTransactionBlock.sender.address`.
2. Re-scanned *all* mainnet packages (confirmed total: **747
   packages**) and checked each one's `linkage { originalId }` field
   for any entry pointing at a Studio 0a0d package address.
3. For any studio-0a0d package whose linkage pointed at a non-stdlib
   dependency, inspected the dependency's deployer + module
   disassembly for brand signals.
4. Secondary WebSearch for `spec_packs IOTA`, `claw_swap_gateway
   IOTA`, `manifest_anchor IOTA Move`.

Scripts (kept for future reuse): `/tmp/studio_0a0d_packages.py`,
`/tmp/linkage_scan.py`.

## Downstream dependency scan results

**No external packages import from Studio 0a0d's packages.** Of the
~714 non-studio-0a0d packages on mainnet, zero contain any Studio 0a0d
`originalId` in their `linkage`. Studio 0a0d's infrastructure is
downstream-isolated (consistent with the "stealth, not yet launched"
hypothesis in the earlier handoff).

**But the *reverse* link broke the case.** Three of Studio 0a0d's own
packages (`spec_sale_v2` deployments
`0x038c68c3…`, `0x7abed39f…`, and siblings) list a non-stdlib
dependency:

- `0xcb9bb938865bdfbb3b9b841279eab1ba793ef8846de68d30fb45c32ef5b78ab4`
  — module `spec_coin` — deployed by
  `0x4468c8ddb42728fd1194033c1dd14ffd015f0d81e4b5329ddc11793c989f3f39`
  (a DIFFERENT address, not Studio 0a0d).
- Its v1 original at `0xf8db3623…` (same second deployer).

That second deployer's only output is two versions of `spec_coin` — i.e.
the **SPEC token itself**, deployed from a token-dedicated wallet that
Studio 0a0d's `spec_sale_v2` / `spec_sale_multicoin` packages then
consume. The sale infrastructure and the sold coin are operated by the
same group but split across two deployer keys — a common pattern so
the sale upgrade authority can't accidentally touch the TreasuryCap.

## Brand signals recovered

The SPEC coin package
(`0xf8db3623b3cb71b9b2e0c0fabb1b62b7264c2a823af42dad0a546b0661e488fa`
and its upgrade `0xcb9bb938…`) carries a CoinMetadata with an icon
URL constant pointing at:

```
https://raw.githubusercontent.com/Moron1337/SPEC/main/Spec.png
```

Additionally Studio 0a0d's own `claw_coin` package
(`0x7a38b9af32e37eb55133ec6755fa18418b10f39a86f51618883aa5f466e828b6`)
exposes:

```
Symbol: CLAW
Name: "Claw Coin"
Max supply: 13,370,000,000,000,000,000  (1337 × 10^16 at 6 decimals)
Icon URL: https://raw.githubusercontent.com/Moron1337/CLAW/main/logo/claw.png
```

SPEC also uses a 1,337-based supply (1,337,000,000,000). Both hit the
"leet / meme" numerology, and **both point at GitHub user
`Moron1337`**.

## Identifying the operator: GitHub user `Moron1337`

`Moron1337` has four public repos, all directly matching Studio 0a0d's
on-chain modules:

| Repo                   | Corresponds to                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `SPEC`                 | Houses the SPEC coin logo used by the spec_coin CoinMetadata                                                                                                                                                                                                                                                                                                                                                                                            |
| `CLAW`                 | Houses the CLAW coin logo                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `openclaw-iota-wallet` | TypeScript plugin "bridges autonomous agents to IOTA blockchain", requires `openclaw-cli` v2026.2.12+ — the "bot" side of the marketplace                                                                                                                                                                                                                                                                                                               |
| `clawnera-bot-market`  | **The marketplace.** README describes: "Open-source knowledge base and CLI for bots and operators using the CLAWNERA marketplace." Supports seller, buyer, request-buyer, request-seller, reviewer, operator journeys; listings, bidding, orders, dispute evidence handling, juror voting — matching Studio 0a0d's `order_escrow`, `dispute_quorum`, `review`, `reputation`, `tier`, `milestone_escrow`, `bond`, `manifest_anchor` modules one-for-one. |

The `clawnera-bot-market` README v0.1.97 (2026-04-15, **two days ago**)
explicitly lists the supported asset:

```
CLAW (6 decimals)
type: 0x7a38b9af32e37eb55133ec6755fa18418b10f39a86f51618883aa5f466e828b6::claw_coin::CLAW_COIN
```

That address is **package #10 in our Studio 0a0d list**, the single
`claw_coin` package. Direct contract-address match — attribution is
now hard-linked.

## Public surfaces

- **SPEC sale UI**: `https://buy.spec-coin.cc/` — states the project
  was "born in the speculative depths of the #speculations channel on
  IOTA Discord" and ships a meme-coin disclaimer.
- **CLAW sale UI**: `https://buy.claw-coin.com` — references the same
  `Moron1337/claw` GitHub logo path.
- **Spec Weekly YouTube channel** (`youtube.com/c/SpecWeekly`) —
  tagline "Speculation for IOTA, Shimmer, and Crypto degenerates",
  almost certainly run by or closely affiliated with the same
  operator. Not yet directly linked on-chain (no `linked_domain` field
  etc.), but the name and the `Moron1337/SPEC` branding make the
  association very strong.

## Attribution verdict

**Studio 0a0d = `Moron1337` on GitHub, a.k.a. the Spec Weekly / IOTA
"#speculations" community operator.**

Confidence: HIGH.

Hard evidence:

1. `clawnera-bot-market` README (MIT-licensed, public, v0.1.97 of
   2026-04-15) embeds the exact on-chain type
   `0x7a38b9af…::claw_coin::CLAW_COIN`, which is Studio 0a0d's
   `claw_coin` package. This is a **direct contract-address**
   identification — the strongest possible single signal.
2. `clawnera-bot-market` describes a marketplace whose workflow
   (seller/buyer/request-buyer/request-seller/reviewer/operator +
   listings + bids + orders + juror voting + dispute evidence)
   matches Studio 0a0d's 15 commerce-marketplace packages module-for-
   module (`admin`, `bond`, `deadline_ext`, `dispute_quorum`, `escrow`,
   `listing_deposit`, `manifest_anchor`, `milestone_escrow`,
   `mutual_cancel`, `order_escrow`, `order_mailbox`, `payment_assets`,
   `reputation`, `review`, `rewards`, `tier`).
3. The SPEC token metadata (used by Studio 0a0d's `spec_sale*`) points
   at the `Moron1337/SPEC` GitHub logo — tying the second deployer
   (`0x4468c8dd…`) to the same operator.
4. Both tokens use a 1,337-based max supply (SPEC: 1.337e12, CLAW:
   1.337e19) — stylistic signature consistent with a single meme-coin
   operator.

## Additional findings & follow-ups

- **Second deployer discovered.** `0x4468c8dd…` is the SPEC-coin-only
  deployer (2 packages: `spec_coin` v1 + v2). It's logically part of
  the same team as Studio 0a0d but is a separate key. Add it to the
  team record as a secondary deployer so our scanner attributes those
  2 packages correctly — currently uncaught.
- **Brand name to use.** The marketplace brand is **CLAWNERA** (the
  big reveal; previously unknown on-chain). The token is **CLAW**, the
  launchpad is **SPEC**, the operator handle is `Moron1337`, and the
  public-facing presence is the **Spec Weekly** YouTube channel plus
  the IOTA Discord `#speculations` channel. There's no formal
  company/team name — this looks like a one-person or very small
  community-run project, leaning meme-coin.
- **No external downstream customers** — nothing else on IOTA mainnet
  depends on any of Studio 0a0d's packages. Attribution now comes
  entirely from off-chain (GitHub + coin metadata icon URL), not from
  on-chain customers.
- **Secondary module-name searches** (`spec_packs IOTA`,
  `claw_swap_gateway IOTA`, `manifest_anchor IOTA Move`) all returned
  zero relevant hits, confirming these names aren't published
  anywhere public outside Moron1337's own repos.
- **TODO on tokens**: `buy.spec-coin.cc` sale UI existed before today's
  investigation but was not previously connected to this deployer in
  our registry. Worth a follow-up — once SPEC / CLAW start trading
  against IOTA we probably want them in our token-sale / ecosystem
  surfacing.

## Registry corrections (draft)

1. Create a new team (or rename the synthetic `studio-0a0d`) with:
   - id: `clawnera` (or `spec-weekly` — bikesheddable)
   - name: "Clawnera / Spec Weekly" (covers the marketplace + the
     meme-coin brand + the YouTube front-door)
   - url: `https://buy.claw-coin.com` (or the Spec Weekly YT channel,
     or `https://buy.spec-coin.cc/`)
   - deployers:
     - `0x0a0d4c9a9f935dac9f9bee55ca0632c187077a04d0dffcc479402f2de9a82140` (primary; 33 pkgs)
     - `0x4468c8ddb42728fd1194033c1dd14ffd015f0d81e4b5329ddc11793c989f3f39` (SPEC coin; 2 pkgs)
2. Add project defs to surface currently-uncaught packages:
   - `Clawnera Marketplace` → `{all: ['dispute_quorum', 'manifest_anchor', 'order_escrow']}` (catches the 15-module commerce packages; already mostly caught by the existing "Marketplace Escrow" rule — consider renaming that project to `Clawnera Marketplace`).
   - `Spec Launchpad` → `{any: ['spec_sale_multicoin', 'spec_sale_v2', 'spec_packs']}` (current rule misses `spec_packs`).
   - `Claw` → `{any: ['claw_coin', 'claw_swap_gateway']}` (currently unattributed).
   - `SPEC Coin` → match on packageAddresses `[0xf8db3623…, 0xcb9bb938…]` at the second deployer — since the module name `spec_coin` is generic enough to collide.

## Status change

Previously 🟠 UNVERIFIED. Recommend flipping to 🟡 or [x] once the
registry rows above land — the attribution chain is now public,
reproducible, and anchored by a direct contract-address match inside
an MIT-licensed README (not just a circumstantial icon URL). Remove
from `threads.md`'s "stays until public launch" section — Clawnera's
docs and sale sites are already live on the public web; the "launch"
predicate is effectively satisfied.
