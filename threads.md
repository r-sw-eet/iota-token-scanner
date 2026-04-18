# Open Threads

Follow-up questions and open work items for teams verified in `handoff.md`.
Each thread lists the team, the current gap, and what would close it.

Categorized so you can pick by energy / time budget:

- **Attribution-strengthening** — investigative work to upgrade a partially-
  verified team toward gold-standard (web / Playwright / social-trace).
- **Registry-expansion** — team is attributed, but additional uncaptured
  packages or sub-products deserve their own rows.
- **Registry-correction** — code changes waiting (renames, match-rule fixes,
  dead-def pruning). No more investigation needed, just apply the patches.
- **Architectural curiosity** — not blocking, but worth understanding.

---

## Attribution-strengthening

### Pools Finance — farming deployer is circumstantial only

Current: Zokyo audit gold-standard proves the AMM deployers
(`0x519e…800c`, `0xeada…88e7`). The farming deployer
(`0x2130…3542`) is covered only by on-chain-shape evidence (packages
contain `farm`/`irt`, narrow scope, `irt` matches Pools Finance's
reward-token branding). No audit, no public address reference.

Close via: launch `pools.finance` in Playwright via the `browser`
skill, walk through a farming-stake flow, capture the outgoing Move
call's `target` field. One network payload naming
`0x2130…3542::farm::…` elevates to gold-standard.

### IOTA Foundation (Testing) — only remaining 🟡 among IF products

Current: Pattern-attribution strong (79 packages across 3 related
deployers, NFT tags like `gas_station_*` / `transfer_test` /
`regular_comparison`, schema matches Salus's IF-template NFT). No
public document names the 3 deployer addresses as IF-operated.

Close via: grep IOTA's public GitHub repos (`iotaledger/iota-gas-
station`, `iotaledger/iota`, and adjacent IF-run repos) for any of
the 3 deployer addresses in test configs or integration-test
fixtures. Requires authenticated code search
(unauthenticated search returns 401).

### IOTA Foundation (TLIP) — no published package address

Current: Institution-grade attestation via iota.org/solutions,
tlip.io, TMEA partnership, Medium pub, GitHub org `tmea-tlip`. No
single public document publishes the specific Move package address.

Close via: dig deeper into TLIP's wiki (`wiki.tlip.io/docs/`) and
the GitHub repo for a developer-facing page that lists mainnet
deployment addresses; or ask TLIP operators directly.

Note: this gap is TLIP's (their audience is governments/shipping
integrators, not Move devs), not ours. Lower-priority than the
others.

### IOTA Traceability — no canonical iotaledger repo found

Current: IF endorsement via `iota.org/products/traceability`, but
unlike Notarization there's no `iotaledger/traceability` repo
surfaced. Attribution rests on organizational grounds + 3-deployer
coordination pattern.

Close via: one more grep pass across the `iotaledger/*` GitHub org
for a traceability-specific repo; alternately ask IOTA Discord for
the canonical repo link.

### IOTA Flip — anonymous operator (gambling)

Current: Product verified (iotaflip.netlify.app exists, module
struct names embed `IotaFlipHouse`). Team identity unknown —
Netlify free-tier hosting + no public team info is typical for
small gambling operators.

Close via: inspect the Netlify app bundle or connected-wallet flow
for any operator email, contact, ToS page, or X/Discord handle
that could identify the humans. Low-priority unless the site
starts moving non-trivial volume.

### Studio 0x0a0d4c9a — 🟠 stays until public launch

Current: 33 packages across 3 product lines (Spec launchpad, Claw
token + swap gateway, Aegora-style commerce/escrow platform).
Every AdminCap held by the deployer itself, no third-party users,
no brand-leaking fields. Clear stealth-mode ops.

Close via: monitor IOTA Business Innovation Program announcements,
IOTA blog, and IOTA Discord for any announcement mentioning
`Spec`, `Claw`, or a new on-chain marketplace brand. If/when the
team launches publicly, attribution falls out immediately.

Bonus probe: check whether any Move packages outside this deployer
import from `spec_sale_v2::Sale` or `claw_swap_gateway::Gateway` —
downstream users would reveal early partners.

### Studio 0xb8b1380e — upgrade from 🟡 to [x] with ownership confirmation

Current: KrillTube + GiveRep + games + shared infrastructure —
brands identified, but overall team ownership of the deployer key
not publicly stated. Three plausible explanations noted in handoff
(single team behind all; dev shop servicing multiple clients; IF-
adjacent contractor).

Close via: ask in IOTA Discord whose deployer `0xb8b1380e…` is;
alternately inspect the KrillTube operator wallet
(`0xba1e07…20d`) for any branded activity that ties it to the
deployer.

---

## Registry-expansion

### IOTA Notarization — missing IOTA Identity Asset Framework + Accreditation Registry

Current: Notarization's core 5-module package is captured. Two
adjacent products at the same deployer are uncaptured:

- **IOTA Identity Asset Framework** (16/17-module package with
  `asset, borrow_proposal, config_proposal, controller,
  controller_proposal, delete_proposal, identity, migration,
  migration_registry, multicontroller, permissions, public_vc,
  transfer_proposal, update_value_proposal, upgrade_proposal,
  utils`). Governance-over-on-chain-assets with multi-controller
  pattern — a distinct IF product.
- **IOTA Accreditation Registry** (7-module package:
  `accreditation, main, property, property_name, property_shape,
  property_value, utils`). Credential-issuer-style on-chain
  attestations.

Close via: add two new project defs under the consolidated
`iota-foundation` team:

```ts
"IOTA Identity Asset Framework": {all: ['asset', 'multicontroller', 'controller_proposal']}
"IOTA Accreditation Registry":   {all: ['accreditation', 'property', 'property_value']}
```

Both currently invisible on the site.

### IOTA Identity stack — 2 uncaptured variants

Current: 22 of 24 packages captured by the existing Identity (full)
/ Identity (WoT) / Credentials rules.

Uncaptured:

- 1 `{credentials, health_lab_simple, identity, trust}` package
  (health-lab-specific credential variant).
- 1 `{wot_individual_profile, wot_trust}` package (uses
  `wot_individual_profile` not `wot_identity`).

Close via: add a loose fallback project
`IOTA Identity (misc)` matching `{any: ['health_lab_simple',
'wot_individual_profile']}` or similar. Low priority; minor
undercount.

### Studio 0xb8b1380e — split into multiple teams

Current: Single synthetic `studio-b8b1` team lumps KrillTube,
GiveRep, and unbranded games/infrastructure together.

Close via:

- New team `krilltube` (id, name, url https://krill.tube/)
  matching the `tunnel` + `demo_krill_coin` packages.
- New team `giverep` (id, name, url https://giverep.com/)
  matching the `giverep_claim` packages. Optional — could also be
  left as just-a-pool infrastructure since GiveRep's primary
  deployment is Sui.
- Retain `studio-b8b1` as fallback for games (Chess, Tic Tac Toe,
  2048, Gift Drop) and utility (vault, gas_station) packages.

### LayerZero — heavy undercount

Current: Rule `{any: ['endpoint_quote', 'lz_compose']}` catches
1 of 22 LayerZero packages. 21 support packages (ZRO token, ULN302,
DVN/Executor workers, PTB builders, OApp framework) unattributed.

Close via: four options noted in handoff (hardcoded addresses,
deployer-match rule-type, broader module predicate, or split into
LayerZero Endpoint / ZRO / ULN / Workers sub-projects). Decision
is a UX call — is LayerZero one row or many?

### Tradeport — 7 of 15 packages uncaptured

Current: Tradeport bidding + NFT Launchpad rules catch 8 of 15
packages. Uncaptured:

- 2 `kiosk_listings` packages
- 2 `kiosk_transfers` packages
- 2 standalone `listings` packages
- 1 transfer-policy-rules package (6 modules: royalty/floor/kiosk
  lock rules)
- 1 `nft_type` package

Close via: add `Tradeport Kiosk`, `Tradeport Listings`, `Tradeport
Transfer Policies` product defs — or a deployer-match rule type for
the team. Kiosk-based trades are probably a meaningful share of
Tradeport activity currently not counted.

### TokenLabs — multi-product expansion

Current: The staking framework is matched (3 packages). 4 additional
TokenLabs packages (from the second deployer `0x5555…`) are
uncaptured: TLN token, vIOTA liquid staking v1+v2, simple payment.

Close via: add the second deployer to the team's deployer list, and
add new project defs:

- **vIOTA Liquid Staking** → `{all: ['cert', 'native_pool',
  'validator_set']}`. Second liquid-staking protocol on IOTA; our
  site currently doesn't surface it at all.
- **TLN Token** → `{exact: ['tln_token']}`.
- **TokenLabs Payment** → `{exact: ['simple_payment']}` (generic —
  consider `packageAddresses` instead).

Note: IOTA has **two** liquid staking protocols (Swirl + TokenLabs
vIOTA). Our site should reflect that.

### ObjectID — 8 of 12 packages uncaptured

Current: Rule `{all: ['oid_credit', 'oid_identity']}` catches the
4 core-identity versions. Uncaptured: documents, config,
allowlist, utils, GS1 hub.

Close via: either a deployer-match rule for the whole team, or
sub-product defs for each. Recommended:

- `ObjectID Documents` → `{exact: ['oid_document']}`
- `ObjectID GS1 Hub` → `{exact: ['OIDGs1IHub']}`
- `ObjectID Config/Utils` optional

### LiquidLink — 7 of 11 packages uncaptured

Current: Only the original `constant+event+point+profile` core
(4 packages) is matched. Uncaptured: 2 refactored `{core, events}`
v2 packages, 2 `utils` packages, 3 profile-with-like packages.

Close via: expand match rules, or use an umbrella with all 11
addresses.

### izipublish — all packages captured but description wrong

Current: Project description in registry claims this is a
"Simplified Move package publishing tool". Factually wrong —
it's a data-publishing framework serving izipublish.com. No
undercount, just mislabel.

Close via: rewrite description (see handoff corrections), change
category from `Tooling` to `Data / Publishing` or `Infrastructure
/ CMS`.

---

## Registry-correction (pending code changes)

These are all queued in handoff.md's per-team sections. **No more
investigation needed**, just apply the patches.

### Virtue — deployer misattribution + dead-def

1. Remove `0x14effa2d…c3e0` from Virtue team deployers (it's actually
   CyberPerp).
2. Change Virtue's project match from
   `{all: ['liquidity_pool', 'delegates']}` (matches CyberPerp
   packages) to either `packageAddresses: [Virtue's 5 docs-listed
   addresses]` or a Virtue-specific module match.
3. Remove/rewrite the `virtueStability` def — currently matches
   zero packages on mainnet (dead).
4. Virtue Pool (`balance_number + stability_pool`) actually matches
   Virtue's real Stability Pool primitive — consider renaming
   `Virtue Pool` to `Virtue Stability Pool` since our current
   "Virtue Stability" name goes unused.

### Swirl Validator — dead-def

Match rule `{all: ['cert', 'native_pool', 'validator']}` matches
zero packages (confirmed via whole-mainnet scan). TokenLabs uses
`validator_set`, Swirl uses `pool`/`riota` only — neither ships
`validator` as a module name. Drop the def from the registry.

### CyberPerp L1 — add new team + projects

Not in the registry today. Once added:

- Team `cyberperp` with URL `https://cyberperp.io`, deployer
  `0x14ef…c3e0`, Move Bit audit reference.
- Either one umbrella `Cyberperp` project, or split into `Cyberperp
  Perps` / `Cyberperp Swap` / `CYB (L1 Move)` / `Cyberperp OFT`.

Note that this will create two CyberPerp rows on the site (L1 via
Move + L2 via DefiLlama). That's accurate — they're genuinely on
both layers — but worth a disclaimer in the project description.

### iBTC → Echo Protocol (rename)

- Team id `ibtc` → `echo-protocol`, name `iBTC` → `Echo Protocol`.
- Project `iBTC Bridge` → `Echo Protocol Bridge`.
- Optionally tighten the match rule to
  `{all: ['bridge', 'committee', 'ibtc', 'treasury']}` for extra
  specificity.

### Bolt Protocol → Bolt.Earth (rename)

- Team id `bolt-protocol` → `bolt-earth`, name → `Bolt.Earth`.
- Project `Bolt Protocol` → `Bolt.Earth RealFi`.
- URL `https://bolt.earth`.
- Category `Protocol` → `DePIN / RWA`.

### Easy Publish → izipublish (rename + description rewrite)

- Team id `easy-publish` → `izipublish`.
- Project `Easy Publish` → `izipublish`.
- Rewrite description (current text is factually wrong — see
  handoff).
- Category `Tooling` → `Data / Publishing`.
- Add second deployer `0x7c33d09b…0af429` (the publisher address).

### Points System → LiquidLink (rename)

- Team id `points-system` → `liquidlink`, name → `LiquidLink`.
- Project `Points System` → `LiquidLink`.
- URLs: https://www.liquidlink.io, https://iota.liquidlink.io.
- Category `Loyalty` → `Incentive / Social` or `DeFi Infrastructure`.

### Staking (generic) → TokenLabs (rename + expand)

- Team id `staking-generic` → `tokenlabs`.
- Add second deployer `0x5555679093281ffa85c51c24b55fc45ff0f1bb6a57c0bee2c61eae3d5b54ae7c`
  (the admin/operator address).
- URLs: https://tokenlabs.network, https://x.com/TokenLabsX.
- Split into multiple product defs (see Registry-expansion section
  above).

### Gambling → IOTA Flip (rename)

- Team id `gambling` → `iota-flip`, name `IOTA Flip / Roulette` →
  `IOTA Flip` (drop the slash — roulette is a game, not brand
  name).
- Project `Gambling` → `IOTA Flip`.
- URL: https://iotaflip.netlify.app.
- Either umbrella or split into `IOTA Flip Games` + `IOTA Flip
  Raffle` (the raffle package is currently uncaptured).

### OID Identity → ObjectID (rename + expand)

- Team id `oid` → `objectid`, name → `ObjectID`.
- Project `OID Identity` → `ObjectID`.
- URLs: https://objectid.io, https://www.iota.org/learn/showcases/objectID.
- Category `Identity` → `RWA / Product Authenticity`.
- Expand match (see Registry-expansion section).

### TLIP (promote to standalone brand)

- Team id `if-tlip` → `tlip`, name `IOTA Foundation (TLIP)` → `TLIP`.
- Description: surface the TMEA partnership.
- Project `TLIP (Trade)` → `TLIP`.
- File rename: `teams/trade/if-tlip.ts` → `teams/trade/tlip.ts`.

### IOTA Foundation teams — already consolidated, plus minor naming

The consolidation into `iota-foundation` is done in earlier
commits. Nothing pending for the IF team itself. See Notarization
and Identity sub-threads above for product-level expansion.

---

## Architectural curiosity (non-blocking)

### Salus — why 60 separate packages instead of upgrades?

Not a verification issue. Possible explanations:

- Each batch = distinct legal trade instrument (one Digital
  Warehouse Receipt per package).
- Publishing cheaper than upgrading for very small packages.
- Regulatory/provenance reason — isolated audit trails per trade.

None affect attribution. The fingerprint rule catches all 60
regardless.

### IOTA Traceability — why 3 deployers?

Possibilities:

- Per-customer key separation (food / pharma / logistics each
  isolated).
- Staging vs. production split.
- Multi-region ops.

All explanations still attribute to IF as the orchestrator. Not
a verification gap.

### Studio 0xb8b1380e — are the games developed by the same team as KrillTube/GiveRep?

Evidence leans yes: `tic_tac_iota::AdminCap` is owned directly by
the deployer `0xb8b1…`, and Chess/2048 Treasury objects are
shared-object-administered by the deployer. Suggests single-team
ops across games + KrillTube + GiveRep. Not conclusive — could
also be a dev shop publishing multiple projects from one key.

---

## Meta-thread: **nothing has been shipped to the registry yet**

Every [x] VERIFIED in handoff.md implies a registry correction, but
the files under `api/src/ecosystem/teams/*.ts` and
`api/src/ecosystem/projects/*.ts` still hold the old pre-detective-
work labels. The biggest outstanding work item is a single
coordinated pass that applies the queued corrections from all the
Registry-correction threads above, plus a ratcheted recapture to
populate live snapshots with the new attributions.

Sequence when we execute:

1. Apply all renames (`bolt-protocol` → `bolt-earth`, etc.).
2. Apply all description rewrites.
3. Apply all match-rule changes (expand LayerZero/Tradeport/etc.,
   prune dead defs).
4. Add CyberPerp L1 new project + team.
5. Run tests + coverage check.
6. Deploy + recapture.
7. Verify the live `/ecosystem` endpoint reflects the new
   attributions.

Until this pass runs, the live site still shows "Points System",
"Bolt Protocol", "iBTC", "Gambling", "OID Identity", "Staking",
"Easy Publish", "Virtue" (pointing at CyberPerp packages), etc.

---

## Thread ownership / priority

| Priority | Thread                                             | Why                                               |
|----------|----------------------------------------------------|---------------------------------------------------|
| P0       | Apply queued registry corrections                  | Live site is wrong until this runs                |
| P1       | Add CyberPerp L1 to registry                       | Product is on-chain, completely invisible on site |
| P1       | IOTA Notarization: Asset Framework + Accreditation | 2 IF products totally invisible                   |
| P2       | LayerZero / Tradeport / TokenLabs undercount       | Real activity not counted toward right team       |
| P2       | Pools Finance farming Playwright proof             | Only gold-standard upgrade needed in that team    |
| P3       | IF Testing grep across iotaledger                  | Upgrade 🟡 → [x] for the one remaining IF gap     |
| P3       | Studio b8b1 Discord ask                            | Could bump it from 🟡 to [x]                      |
| P4       | Studio 0a0d watch                                  | Passive; wait for launch announcement             |
| P4       | Curiosity threads                                  | Non-blocking, fun-to-know                         |
