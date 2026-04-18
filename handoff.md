# Handoff — 2026-04-17

Context dump so the next session can pick up mid-stream without replaying
the whole conversation. Delete after read.

## What shipped this session (three commits, all on `main`, all deployed)

1. **`b6db6b7` — IOTA-chain TVL slice only** (`api/src/ecosystem/ecosystem.service.ts`)
   - Was reading `proto.tvl` from DefiLlama's `/protocols` feed (cross-chain total).
   - Now reads `proto.chainTvls['IOTA']` for L1, `proto.chainTvls['IOTA EVM']` for L2.
   - Same $100 floor applied to the chain slice (not cross-chain total).
   - Added unit-test coverage for `chainTvls`-missing edge cases; ratcheted
     branches coverage 89.64% → 90.36%.

2. **`532519e` — team registry consolidation + `project-mapping.md`**
   - Merged `pools-farming` → `pools-finance` (farming deployer added to list).
   - Merged `virtue-pool` → `virtue` (accounting deployer added to list).
   - Merged `if-core`, `if-identity`, `if-notarization`, `if-traceability`
     → new consolidated `iota-foundation` team
     (`api/src/ecosystem/teams/misc/iota-foundation.ts`).
   - Kept separate: `if-tlip` (distinct public product at tlip.io) and
     `if-testing` (single-project team required for team-deployer routing
     out of the NFT Collections bucket — merging it would break that
     routing).
   - Added `project-mapping.md` at repo root — wide reference doc mapping
     every curated display name to on-chain evidence. Includes
     "Where on-chain a match string lives" legend and "Why pairs of
     module names" explanation.
   - `FAQ.md` gained a new high-level section on project/team
     identification.

3. **`9d19f40` — `attribution` prose for every project and team**
   - Added optional `attribution?: string` to `ProjectDefinition` and
     `Team` interfaces (and the runtime `Project` type + `ProjectDoc`
     Mongo schema).
   - Populated every L1 project def (~30) and every team def (~20) with
     prose explaining the naming provenance (what on-chain evidence, and
     how we know it maps to the named project).
   - Surfaced on the project details page only —
     `website/pages/project/[slug].vue` has a new "Why we call this
     `<Name>`" section above the existing Identification section. Listing
     tables intentionally unchanged.

After all three commits landed on the server, ran a manual recapture
via `docker exec iota-trade-scanner-api node -e "…"` pattern (see
`~/.claude/CLAUDE.md` for the SSH alias and `api/src/backfill-senders.ts`
for the Nest bootstrapping pattern). Fresh snapshot saved with the new
team IDs populated. Verified `/api/v1/ecosystem/teams/iota-foundation`
returns 7 projects; old `/api/v1/ecosystem/teams/if-notarization` now
404s as expected (intentional; that team id is gone).

Tests: 149 API unit + 16 functional + 30 website unit — all green.
Coverage baseline at `api/.coverage-baseline.json` was ratcheted.

## Where we stopped (mid-investigation)

The user asked for **detective work to verify Pools Finance attribution**
— confirming that the three registered deployers really belong to
Pools Finance (and not false-positives). We were walking the four-step
plan described in the conversation:

- **Step 1 (on-chain scan) — DONE.** Scanned all ~747 mainnet packages
  via GraphQL, filtered to the three Pools Finance deployers. Result is
  clean:
  - `0x519e…800c`: 9 upgrade versions of the same 10-module AMM package
    (modules `amm_config`, `amm_entries`, `amm_math`, `amm_router`,
    `amm_stable_utils`, `amm_swap`, `amm_utils`, `stake`,
    `stake_config`, `stake_entries`).
  - `0xeada…88e7`: 1 package with the identical 10-module AMM signature.
    Probably the first published version before they switched deployers.
  - `0x2130…3542`: 5 farming packages. V1 had `{farm, farm_dual, irt}`;
    v2+ added `farm_yield`. Pure farming/reward contracts. `irt` is
    Pools Finance's farming reward token.

- **Step 2 (public attestation) — DONE, gold-standard proof found.**
  The Zokyo audit report at
  `https://github.com/zokyo-sec/audit-reports/blob/main/Pools%20Finance/Pools_Finance_Zokyo_audit_report_May12_2025.pdf`
  explicitly states:
  > The source code of the smart contract was taken from the Pools
  > Finance repository: `https://github.com/Pools-Finance/pools-protocol/commit/13349bc17fc2f93e3f56e86b6f8b6b07865f9b9e`
  >
  > Within the scope of this audit, the team of auditors reviewed the
  > following contract(s): `amm_config.move`, `amm_entries.move`,
  > `amm_math.move`, `amm_router.move`, `amm_stable_utils.move`,
  > `amm_swap.move`, `amm_utils.move`, `stake_config.move`,
  > `stake_entries.move`, `stake.move`

  That's the exact 10-module set we see on-chain at `0x519e…800c` and
  `0xeada…88e7`. Chain of evidence for the AMM deployers is solid:
  - Public repo `Pools-Finance/pools-protocol` contains 10 `.move`
    files.
  - Independent auditor Zokyo confirms the repo is Pools Finance's and
    audits those 10 files.
  - Mainnet shows exactly two deployers publishing packages with those
    10 module names.
  - Therefore those two deployers ship Pools Finance's AMM.

  **Farming deployer (`0x2130…3542`) is not yet verified with the same
  gold-standard proof.** The audit scope didn't cover farming. We tried
  listing the `Pools-Finance` GitHub org's repos to find a farming/yield
  repo, but the `curl` call returned empty (either rate-limited,
  network hiccup, or the org is private). That's the thread that was
  live when this handoff was requested.

## What to do next

- **Retry the GitHub org listing**:
  ```
  curl -s 'https://api.github.com/orgs/Pools-Finance/repos?per_page=100' | jq '.[].name'
  ```
  If the org has a `pools-farming` / `pools-yield` / `farm` repo, that
  alone tying it to the same GitHub org (which the audit certified is
  Pools Finance) would close the loop. Alternatively, Pools Finance's
  docs (`docs.pools.finance/farming` or similar subpage) may have a
  direct on-chain address reference — earlier we only fetched the root
  `/security` page.

- **If no farming source/attestation is findable**, fall back to
  **Step 3 — browser-level proof**: launch `app.pools.finance` via the
  `browser` skill (Playwright), navigate to the farming/staking page,
  click through a "stake LP" or similar flow, capture outgoing tx
  `target` fields. One network payload naming `0x2130…3542::farm::…`
  closes the loop irrefutably.

- Once the farming deployer is verified, update
  `api/src/ecosystem/teams/defi/pools-finance.ts` — the `attribution`
  field there currently just mentions "browser devtools" as the
  method; worth rewriting it to cite the Zokyo audit for the AMM
  deployers and the farming proof (whichever lands) for the third.
  Same pattern applies to other teams the user may want to verify
  rigorously (Virtue, Swirl, Tradeport, etc.).

- Consider whether **`Virtue Stability`** (def exists, but no rows on
  mainnet currently match) is dead weight. The most recent snapshot has
  52 projects and none of them is "Virtue Stability". Either drop the
  def or adjust its match rule to reflect what Virtue is actually
  deploying. Noted in the snapshot diff discussion earlier but not
  acted on.

## Useful file paths / pointers

- **Scanner entrypoint**: `api/src/ecosystem/ecosystem.service.ts`
  (`matchProject` at ~line 284, `fetchFull` at ~line 398, recapture
  entry point `capture()` at line ~74).
- **Project registry**: `api/src/ecosystem/projects/` (one file per
  project, `index.ts` enumerates and sets match priority).
- **Team registry**: `api/src/ecosystem/teams/` (same shape; `index.ts`
  has `getTeamByDeployer`).
- **Canonical reference doc**: `project-mapping.md` at repo root —
  everything we currently know, laid out in tables.
- **FAQ**: `FAQ.md` — has the L1 identification overview for non-devs.
- **Details page**: `website/pages/project/[slug].vue` — renders
  `attribution` + `team.attribution`.
- **SSH into prod** (per `~/.claude/CLAUDE.md`):
  `ssh -o BatchMode=yes -i ~/.ssh/iota-trade-scanner root@178.105.6.212 '<cmd>'`
- **Mongo auth**: user `scanner`, pw
  `OqreGJi87JpKMAog9RygFmGin8cQZ2to` against `admin` db; data in
  `scanner` db, collections `ecosystemsnapshots`, `projectsenders`,
  `snapshots`.
- **Manual recapture pattern** (non-destructive, appends a fresh
  snapshot):
  ```bash
  ssh -o BatchMode=yes -i ~/.ssh/iota-trade-scanner root@178.105.6.212 \
    'docker exec iota-trade-scanner-api node -e "
      const { NestFactory } = require(\"@nestjs/core\");
      const { AppModule } = require(\"./dist/app.module\");
      const { EcosystemService } = require(\"./dist/ecosystem/ecosystem.service\");
      (async () => {
        const app = await NestFactory.createApplicationContext(AppModule, { logger: [\"log\",\"warn\",\"error\"] });
        try { await app.get(EcosystemService).capture(); } finally { await app.close(); }
      })().catch(e => { console.error(e); process.exit(1); });
    "'
  ```

## Open loose ends (not urgent)

- **iBTC Bridge, Bolt Protocol, Gift Drop, Easy Publish, Points System,
  Staking (generic), OID Identity** — still have no public-source URL
  in their `sources`/`attribution`. Attribution rests on deployer
  isolation + module-name signatures. Same detective protocol could
  verify each one.

- **Studios** (`0xb8b1380e`, `0x0a0d4c9a`) — anonymous, synthetic team
  names derived from deployer prefix. If either is ever identified as
  a named team, rename and migrate projects.

---

# Verified attributions (append-only log)

## 2026-04-17 — Pools Finance [x] CLOSED

Full provenance established for all three Pools Finance deployers.
This section is the long-form record so the next session doesn't
re-litigate.

### AMM deployers `0x519e…800c` and `0xeada…88e7` — gold-standard proof

**Public attestation:** Independent security firm Zokyo audited the
Pools Finance AMM. Audit PDF is hosted in Zokyo's public GitHub
audit-reports repo:

- Report: `https://github.com/zokyo-sec/audit-reports/blob/main/Pools%20Finance/Pools_Finance_Zokyo_audit_report_May12_2025.pdf`
- Page 5 of the report (Auditing Strategy) explicitly names the repo
  and the exact commit hash reviewed:
  `https://github.com/Pools-Finance/pools-protocol/commit/13349bc17fc2f93e3f56e86b6f8b6b07865f9b9e`
- Scope: the ten source files `amm_config.move`, `amm_entries.move`,
  `amm_math.move`, `amm_router.move`, `amm_stable_utils.move`,
  `amm_swap.move`, `amm_utils.move`, `stake_config.move`,
  `stake_entries.move`, `stake.move`.

**On-chain match:** querying mainnet via
`packages.nodes.previousTransactionBlock.sender.address`, exactly two
deployer addresses ever published Move packages whose module set
matches that ten-file list. Both addresses are in our registry as
`pools-finance` deployers:

- `0x519ebf6b900943042259f34bb17a6782061c5b6997d6c545c95a03271956800c`
  — 9 upgrade versions of the 10-module package.
- `0xeadab2493d7aff3ac3951e545e9c61bef93dee1915e18aff50414d72067f88e7`
  — 1 package, same signature (likely v0 before they switched to the
  primary deployer).

**Conclusion:** third-party auditor certifies the GitHub repo as
Pools Finance's, the audit enumerates the exact module file list, and
only those two deployers ship packages matching that list on mainnet.
Attribution is conclusive; no false-positive pathway is plausible.

### Farming deployer `0x2130…3542` — strong circumstantial proof

**Public attestation:** not covered by the Zokyo audit; the
`Pools-Finance` GitHub org's repos are all private (org lists zero
public repos — verified against `api.github.com/orgs/Pools-Finance/repos`).
Pools Finance does publicly describe a farming product on
pools.finance and in their Medium launch post
`https://medium.com/@Pools_Finance/introducing-pools-the-first-dex-on-iota-rebased-0d020eea6957`,
but neither source lists the deployer address.

**On-chain match:** single deployer publishing five upgrade versions
of a pure farming/reward package:

- v1: `{farm, farm_dual, irt}` (3 modules)
- v2–v5: `{farm, farm_dual, farm_yield, irt}` (4 modules, added
  `farm_yield`)

The `irt` module is Pools Finance's farming reward token name
(observable in Pools Finance's public product messaging as their
reward-token abbreviation). The deployer publishes *only* farming
packages — no off-topic contracts. No other mainnet deployer has
shipped anything with the `irt` module.

**Conclusion:** not gold-standard (no third-party attestation tying
this specific address to Pools Finance), but the combination of
product-specific module naming (`irt`), Pools Finance's public
farming product messaging, and the deployer's narrowly-scoped footprint
makes an alternative explanation implausible. Good enough to treat as
closed without further action.

**Upgrade path if ever needed:** launch `app.pools.finance` in
Playwright via the `browser` skill, navigate to the farming/staking
page, capture outgoing tx `target` fields. One network payload naming
`0x2130…3542::farm::…` would elevate this to gold-standard.

### Action items completed

- Recorded the provenance in code: `api/src/ecosystem/projects/defi/pools-finance.ts`
  `attribution` fields for both project defs, and
  `api/src/ecosystem/teams/defi/pools-finance.ts` `attribution` for the
  team.
- `project-mapping.md` table row for Pools Finance / Pools Farming
  reflects the merged team and the module signatures.
- No code change required from this verification — the existing
  registry was already correct.

---

## 2026-04-18 — Pools Finance farming deployer [ ] CORRECTION (not Pools Finance — IotaRoyale)

Re-investigation of `0x21303d10b1369c414f297a6297e48d6bce07bec58f251ea842c7b33779283542`
overturned the prior "Pools Finance farming" attribution recorded in
the 2026-04-17 entry above. The deployer is **IotaRoyale**, a separate
team running a Parchís / board-games product on IOTA with its own
`$IRT` reward token that farms on Pools Finance's DEX — a *customer*
of Pools, not the operator.

Chain of evidence:

- `iotax_getCoinMetadata` on `0x95690908…::irt::IRT` returns
  `name: "IotaRoyale Token"`, `iconUrl: https://iotaroyale.com/logo.png`
  (a royal-lion mascot, not Pools Finance's blue-duck branding).
- `app.pools.finance` Next.js bundle (38 chunks, grepped 2026-04-17)
  contains **zero** references to `0x21303d10…`, any of its 5 farming
  package addresses, or the IRT coin type.
- Pools Finance's own staking is inside the audited AMM package
  (modules `stake`, `stake_config`, `stake_entries`) — no separate
  farming package exists on the Pools side.
- IotaRoyale's marketing (YouTube `watch?v=6530JLNTqoU` Feb 2026,
  GeckoTerminal IRT/vIOTA pool) explicitly describes "IRT farms" +
  "TLN farm" matching the `{farm, farm_dual, farm_yield, irt}` shape.

**Registry impact:** drop `0x21303d10…` from
`api/src/ecosystem/teams/defi/pools-finance.ts` deployers; rewrite the
`Pools Farming` project def to match `{stake_config, stake_entries}`
on AMM deployers (or delete). Create new `iotaroyale` team (Gaming /
GambleFi). Also register the newer Pools AMM package
`0xc0d034…c62332` (published by known deployer `0x519e…800c`).

**Attribution status for Pools Finance after fix:** both AMM
deployers gold-standard via Zokyo; no circumstantial attribution
remains.

Full record: `thread-pools-farming.md`.

---

## 2026-04-18 — Unified registry corrections (Virtue / Swirl / iBTC / Bolt / izipublish / IOTA Flip / TLIP) [x] PATCHES DRAFTED

Consolidated patch plan ready for the queued renames, misattribution
fixes, and dead-def cleanups. All code paste-ready; no files under
`api/src/` edited yet.

- **Virtue** — drop `0x14effa2d…c3e0` from Virtue deployers (it's
  CyberPerp); replace project match `{all: [liquidity_pool,
  delegates]}` (matches CyberPerp's GMX fork, not Virtue) with
  `packageAddresses` pinning Virtue's 5 docs-listed addresses from
  `docs.virtue.money/resources/technical-resources`; delete dead
  `virtueStability` def; rename `Virtue Pool` → `Virtue Stability
  Pool` (it's Virtue's real stability-pool primitive).
- **Swirl Validator** — delete dead `swirlValidator` def (0 mainnet
  matches; Swirl ships `pool`/`riota`, not `validator`).
- **iBTC → Echo Protocol** — team id `ibtc` → `echo-protocol`,
  project `iBTC Bridge` → `Echo Protocol Bridge`.
- **Bolt Protocol → Bolt.Earth** — team id + project rename, URL
  `https://bolt.earth`, category `Protocol` → `DePIN / RWA`.
- **Easy Publish → izipublish** — rename, add publisher deployer
  `0x7c33d09b…0af429`, rewrite description (old text factually wrong
  — not a "publishing tool"; it's a data-publishing framework serving
  izipublish.com), category `Tooling` → `Data / Publishing`.
- **Gambling → IOTA Flip** — team/project rename, URL
  `https://iotaflip.netlify.app`, drop slash in prior
  "IOTA Flip / Roulette" (roulette is a game, not brand name).
- **TLIP** — promote from `if-tlip` to standalone `tlip`; file move
  `teams/trade/if-tlip.ts` → `teams/trade/tlip.ts`; functional-spec
  expects `tlip` / `TLIP` strings after apply.

**Execution order** matters: Virtue fix must land before CyberPerp L1
is added, otherwise CyberPerp packages stay claimed by Virtue's rule.

Full record: `thread-registry-corrections.md`.

---

## 2026-04-18 — CyberPerp (L1 Move) [x] PATCHES DRAFTED — new team + project

Paste-ready registry addition for CyberPerp's 11 L1 Move packages
(currently invisible on site; previously misattributed to Virtue).
Deployer: `0x14effa2d3435b7c462a969db6995003cfd3db97f403ad9dd769d0a36413fc3e0`.
Reference: Move Bit audit + `cyberperp.io`.

- New team `cyberperp` with URL `https://cyberperp.io`.
- Either umbrella `Cyberperp` project, or split into `Cyberperp Perps`
  / `Cyberperp Swap` / `CYB (L1 Move)` / `Cyberperp OFT`.
- Recommendation (Option 2a): disclaimer prose in the L1 row's
  `description` explaining the L2/L1 split — CyberPerp is also on
  IOTA EVM via DefiLlama, so two rows is accurate but needs a
  one-sentence caveat to prevent user confusion. Two rows are *not*
  double-counted (layer-specific TVL/volume).

**Dependency:** lands after Virtue fix (otherwise Virtue's bad
`{liquidity_pool, delegates}` rule would still grab these packages).

Full record: `thread-cyberperp-add.md`.

---

## 2026-04-18 — LayerZero [x] PATCHES DRAFTED — undercount fix (1 → 22 packages)

Re-verified 2026-04-17: 22 LayerZero packages at deployer
`0x8a81a6096a81fe2b722541bc19eb30e6c025732638375c362f07ea48979fd30a`;
current rule `{any: [endpoint_quote, lz_compose]}` catches only 1.

**Recommended fix:** widen the `any:` module predicate to cover the
LayerZero-exclusive module vocabulary across all 22 packages while
avoiding generic words (`utils`, `hash`, `bytes32`, `call`, etc.)
that risk future false positives as the ecosystem grows. This
auto-catches future LayerZero components without a code change, which
a hardcoded `packageAddresses` list wouldn't.

Rejected:
- Hardcoded addresses (doesn't auto-catch upgrades).
- New `deployerAddresses` rule type (tracked separately; would benefit
  ObjectID / LiquidLink / TokenLabs too).
- Splitting into sub-projects (`Endpoint` / `ZRO` / `ULN` / `Workers`)
  — UX call; current recommendation is one row.

**Testing:** add table-driven jest case asserting the rule matches
exactly the 22 known package signatures.

Full record: `thread-layerzero-undercount.md`.

---

## 2026-04-18 — Tradeport [x] PATCHES DRAFTED — undercount fix (8 → 15 packages)

Inventoried both Tradeport deployers (`0x20d666d8…` 12 pkgs,
`0x4ecf96…` 3 pkgs). Current rules catch 8 of 15; draft adds three
new project defs:

- `tradeportKiosk` → `{exact: [kiosk_listings]}` / `{exact:
  [kiosk_transfers]}` (4 packages).
- `tradeportListings` → `{exact: [listings]}` (2 packages).
- `tradeportTransferPolicies` → `packageAddresses` pinning the
  6-module royalty/floor/kiosk-lock rules package (1 package).

One package (`nft_type`) left unattributed — either add a 4th
`packageAddresses` def, or (preferred) wait for the
`deployerAddresses` rule-type addition that would benefit multiple
multi-product teams.

`packageAddresses` used over module rules where module names risk
generic collisions (e.g. `listings`).

Full record: `thread-tradeport-undercount.md`.

---

## 2026-04-18 — IOTA Notarization [x] PATCHES DRAFTED — 2 uncaptured IF products

Notarization deployer `0x56afb2ed…6c8f` ships 4 packages; current
rule catches only the core. Two adjacent IF products at the same
deployer are uncaptured:

- **IOTA Identity Asset Framework** (16/17-module governance-over-
  on-chain-assets package; multi-controller + borrow / config /
  delete / transfer / upgrade proposals). Match:
  `{all: [asset, multicontroller, controller_proposal]}`.
- **IOTA Accreditation Registry** (7-module credential-issuer
  attestation registry). Match: `{all: [accreditation, property,
  property_value]}`.

Both categorized as `Identity` (matches existing vocabulary; no
slash-compound categories elsewhere). Registered under consolidated
`iota-foundation` team (not separate IF sub-teams).

After apply, `/ecosystem/teams/iota-foundation` should expose 9
projects (current 7 + these 2). Thread entry "all 5 of 5 packages
captured" should then replace the current Notarization count in the
handoff.

Full record: `thread-notarization-expand.md`.

---

## 2026-04-18 — TWIN Foundation [x] PATCHES DRAFTED — new team + project

New standalone team + project for **TWIN** (Trade Worldwide
Information Network) — IOTA's Swiss-based trade-digitization parent
foundation that sits above TLIP.

- TWIN deployer: `0x164625aa…19abe` (6 packages, single-module
  `verifiable_storage` upgrade line).
- TLIP (already registered) is TWIN's Kenya customs deployment;
  TWIN itself ships the generic `verifiable_storage::store_data`
  anchor for W3C Verifiable Credentials of type `ImmutableProof`.

**Gold-standard attribution:** `https://manifesto.iota.org/`
explicitly links mainnet tx `GJ6arr…MhEc` as TWIN's first mainnet
transaction; that tx's MoveCall target is
`0xf9510519…cc13::verifiable_storage::store_data`; the VC payload
references `schema.twindev.org/immutable-proof/` (TWIN's official
schema domain). Sponsored-tx pattern (`gasData.owner` ≠ sender) is
consistent with manifesto's "non-crypto-native users" positioning.

Scanned for `immutable_proof`, `auditable_item_graph`, `attestation`,
`tokenization`, `hierarchies` — documented on `twindev.org` but not
yet on mainnet as Move modules (they live in TWIN's TypeScript SDK).
Registry broadened later as more lands.

**Cross-thread overlap:** `0x164625aa…` is one of the three
deployers the "IOTA Foundation (Testing)" section at line 2020 lists.
17 packages total at this deployer: 6 TWIN `verifiable_storage` + 11
`nft` test fixtures. The TWIN match rule `{all: [verifiable_storage]}`
will cleanly claim the 6; the remaining 11 continue to route via the
IF-Testing NFT-Collections path. No conflict but update the IF
(Testing) section to note the shared-deployer reality.

Files staged but not committed:
`api/src/ecosystem/{teams,projects}/trade/twin-*`, plus `_index.ts`
and top-level `index.ts` 2-line edits.

Full record: `thread-twin-verifiable-storage.md`.

---

## 2026-04-18 — IOTA Foundation (TLIP) [x] CLOSED — no address-level upgrade available

Searched for any public document directly naming the TLIP package
address `0xdeadee97…e108` or deployer `0xd7e2de…5176`. None found.

Checked:
- `wiki.tlip.io` — 45 markdown files grepped; all predate the Move
  migration (still documents IOTA 1.x with IRI nodes / MAM / Devnet).
- `tmea-tlip` GitHub org — only infrastructure + docs repos; no Move
  sources, no `Move.toml`, no contract repo.
- Community commentary — public narrative still says TLIP "may launch
  on mainnet in Q1 2026" while the package was actually deployed
  earlier (pre-launch-marketing gap).

**Attribution stays [x]** on organizational grounds (IF endorsement +
tlip.io + wiki + tmea-tlip GitHub + module fingerprint `{ebl,
carrier_registry, endorsement, interop_control, notarization}` +
vanity-prefix deployer). Gap is **TLIP's publication practice, not
ours** — their audience is governments/shipping, not Move devs, so
there's no product-side incentive to publish the package address.

No action needed until TLIP updates their wiki for Rebased or
open-sources the contract repo.

Full record: `thread-tlip-address.md`.

---

## 2026-04-18 — IOTA Traceability [x] CLOSED — no canonical iotaledger repo exists

Searched `github.com/orgs/iotaledger/repositories?q=traceability`:
**0 repositories**. Full listing across pages 1–4 (~107 repos):
nothing named `traceability`, `trace`, `supply-chain`, or
`provenance`. Closest is an "IOTA Custom Notarization" package
(`audit_trails` module), structurally unrelated to the single-module
`traceability` packages on mainnet.

**Attribution stays [x]** on organizational grounds:

1. IF publicly endorses the product at `iota.org/products/traceability`.
2. 3 deployers ship 6 identical single-module `traceability`
   packages — pattern consistent with coordinated per-customer
   deployment only IF is positioned to run.
3. `traceability` is a unique module name on mainnet (no other
   deployer ships it), so `{all: [traceability]}` cleanly captures
   the product.
4. No competing organization has surfaced.

Gap best explained by the **per-customer managed-service deployment
model** (closer to TLIP than to Notarization's self-serve library).
Follow-ups: ask IOTA Discord; watch for an IF Traceability SDK
release.

Full record: `thread-traceability-repo.md`.

---

## 2026-04-18 — IOTA Foundation (Testing) 🟡 CLOSED (stays circumstantial) + TWIN-overlap discovery

Unauthenticated GitHub code search for the three test deployers
(`0xb83948c6…`, `0x278f2a12…`, `0x164625aa…`) returned no hits.
Attribution stays 🟡.

**Material cross-thread finding:** `0x164625aa…` — one of the three
"IF Testing" deployers, 17 packages — is **also TWIN Foundation's
real deployer** (see 2026-04-18 TWIN entry above). Of the 17
packages at this deployer, 6 are TWIN `verifiable_storage` (the
generic anchor cited in IOTA's manifesto); the remaining 11 are
the `nft` test-fixture packages previously lumped into IF Testing.
So this deployer is shared between TWIN's production anchor and
what still looks like test-campaign output — consistent with TWIN
being IF-co-founded and using an IF-adjacent deployer key.

**Registry implication:** once the TWIN team lands (with this
deployer), the TWIN rule `{all: [verifiable_storage]}` will cleanly
claim the 6 TWIN packages; the remaining 11 test packages at this
deployer keep routing via the IF-Testing NFT-Collections path. No
conflict, but the IF (Testing) section at line 2020 should note
that `0x164625aa…` is shared with TWIN.

**New refinement worth tracking:** tag vocabulary (`gas_station_*`,
`transfer_test`, `regular_comparison`) + gas-station dependency fits
**TWIN Foundation testing** better than IF-proper for *some* of
these 79 packages. TWIN is IF-co-founded, so the parent "IOTA
Foundation" label isn't wrong, but a future refinement may split
"TWIN Foundation (Testing)" off from the IF-proper test campaigns.
TWIN co-launched in May 2025, aligning temporally with gas-station
alpha.

Concrete next steps (ordered by effort):

1. Re-run search periodically; public indexers may pick up addresses
   later.
2. Ask in IOTA / TWIN Discord `#dev` directly.
3. Authenticated GitHub code search
   (`org:iotaledger "<address>"`) — auth-gated, not auth-restricted.
4. Probe TWIN Foundation via `twindev.org` contact channel.
5. Playwright walkthrough of twindev.org package pages.

**Registry impact:** none. Existing "Upgrade paths" list in handoff
is still correct; add "Probe TWIN Foundation" as a 4th path.

Full record: `thread-if-testing.md`.

---

## 2026-04-18 — ObjectID [x] PATCHES DRAFTED — rename + 8 uncaptured packages

Rename team `oid` → `objectid` and expand registry to catch all 12
mainnet packages (current rule catches only 4).

Split into 4 project defs (recommended over an umbrella — surfaces
ObjectID's GS1-hub product which is the most distinctive piece):

- `ObjectID` (core identity) — 4 packages.
- `ObjectID Documents` → `{exact: [oid_document]}` — 3 packages.
- `ObjectID GS1 Hub` → `{exact: [OIDGs1IHub]}` — 1 package.
- `ObjectID Framework` (allowlist / utils support) — 4 packages.

File ops: delete `teams/identity/oid.ts` + `projects/identity/oid-
identity.ts`; create `objectid.ts` + 3 split project files;
swap exports + imports in `_index.ts` and top-level `index.ts`.

No scanner-core match-rule changes needed — existing `all` /
`exact` / `packageAddresses` primitives cover every rule.

After apply: 12 packages attributed to `teamId: 'objectid'`, zero
`anomalousDeployers`.

Full record: `thread-objectid-expand.md`.

---

## 2026-04-18 — LiquidLink [x] PATCHES DRAFTED — rename + 7 uncaptured packages

Rename team `points-system` → `liquidlink`, add URLs
`https://www.liquidlink.io` + `https://iota.liquidlink.io`, and
expand match to catch all 11 LiquidLink packages (current rule only
catches the original 4-module core).

File ops (`git mv` + content rewrite):

- `teams/misc/points-system.ts` → `liquidlink.ts`
- `projects/misc/points-system.ts` → `liquidlink.ts`
- Swap exports in `_index.ts`, swap import + `ALL_PROJECTS` entry in
  top-level `index.ts`.

Optional follow-up: add `/logos/liquidlink.svg` (IOTA app favicon).
No spec files reference the old names; no test impact.

**Sanity after apply:** `/ecosystem/teams/liquidlink` returns 11
packages in a single `LiquidLink` row; `/ecosystem/teams/points-
system` 404s.

Full record: `thread-liquidlink-expand.md`.

---

## 2026-04-18 — TokenLabs [x] PATCHES DRAFTED — rename + 4 new product defs + drop dead Swirl def

Rename team `staking-generic` → `tokenlabs`, add admin/operator
deployer `0x5555…ae7c`, and surface the 4 currently-uncaptured
TokenLabs products.

Rationale for match-rule choices (key subtlety):

1. **`TokenLabs Staking Framework`** keeps `{all: [stake,
   stake_config]}` (rename of existing `Staking`). Pools Finance's
   bundled AMM+stake packages are caught earlier by the Pools
   Finance rule, so no collision.
2. **`TokenLabs Liquid Staking (vIOTA)`** uses `packageAddresses`,
   **not** `{all: [cert, native_pool, validator_set]}` as the
   handoff originally suggested — that module rule false-positively
   attributes 9 non-TokenLabs packages to TokenLabs. Accept the cost
   of pinning addresses (update on vIOTA v3).
3. **`TLN Token`** uses `{exact: [tln_token]}` — TLN is a branded
   module name with zero collisions on mainnet.
4. **`TokenLabs Payment`** uses `packageAddresses` over `{exact:
   [simple_payment]}` — `simple_payment` is generic enough a future
   unrelated team could reuse it.
5. **`swirlValidator` def dropped** — 0 mainnet matches confirmed;
   Swirl's real validator infra isn't published as Move.

**IOTA liquid-staking landscape correction:** site should show
**two** liquid staking protocols (Swirl + TokenLabs vIOTA);
currently only Swirl is surfaced.

Anti-regression test candidates: feed a synthetic `{cert, math,
native_pool, ownership, validator_set}` package deployed by a
non-TokenLabs address and assert it is **not** classified as
TokenLabs Liquid Staking (prevents the original module-rule
suggestion from sneaking back in).

Full record: `thread-tokenlabs-expand.md`.

---

## 2026-04-18 — IOTA Flip ⚫ CLOSED — operator stays anonymous (NL-based solo)

Identity gap cannot be closed with publicly reachable signals.
Attribution of the product itself is solid (deployer
`0xbe956850…6654`, 5 packages, module struct names embed
`IotaFlipHouse` / `IotaFlipRouletteHouse`); operator identity is
deliberately hidden.

Concrete new findings:

- Brand domain `iotaflip.com` registered 2024-11-18 (~5½ months
  before Rebased mainnet) — indicates deliberate planning, not an
  impulse deploy.
- Shared hosting via **Mijndomein / Metaregistrar (NL)** + Netlify
  free/hobby tier → solo-dev or very small team signal, not a funded
  operator.
- No About, footer, social handles, GitHub, audit, ToS, or contact
  email anywhere — not in the frontend, not in the SvelteKit bundle,
  not in on-chain metadata.

**Registry change:** add **"Anonymous operator (NL)"** as an honest
descriptor in the `iota-flip` team description (the NL locality is
the one new concrete attribute worth surfacing).

Upgrade triggers (none actionable yet): operator self-doxxes; IOTA
Discord names them publicly; crypto-news coverage; on-chain flow
analysis links deployer to an identity-bearing address.

Full record: `thread-iotaflip-operator.md`.

---

## 2026-04-18 — Studio 0x0a0d4c9a [x] IDENTIFIED — `Moron1337` / Clawnera / Spec Weekly

**Major attribution upgrade** via downstream dependency scan +
GitHub repo discovery. Previously 🟠 UNVERIFIED; now hard-linked.

Chain of evidence:

1. Scanning all 747 mainnet packages for `linkage` pointing at
   Studio 0a0d packages: **zero external downstream customers** —
   but the reverse direction broke the case. Three `spec_sale_v2`
   packages depend on `spec_coin` at a *different* deployer
   `0x4468c8dd…` (SPEC coin-only; 2 pkgs), logically the same team
   on a dedicated token key.
2. SPEC CoinMetadata icon URL:
   `https://raw.githubusercontent.com/Moron1337/SPEC/main/Spec.png`.
   CLAW CoinMetadata icon URL:
   `.../Moron1337/CLAW/main/logo/claw.png`.
3. GitHub user `Moron1337` has 4 public repos: `SPEC`, `CLAW`,
   `openclaw-iota-wallet`, **`clawnera-bot-market`**.
4. `clawnera-bot-market` README (MIT-licensed, v0.1.97 of 2026-04-15)
   embeds the exact on-chain type
   `0x7a38b9af…::claw_coin::CLAW_COIN` — which is package #10 in our
   Studio 0a0d inventory. **Direct contract-address match** = the
   strongest single attribution signal possible.
5. The repo's workflow (seller / buyer / request-buyer / reviewer /
   operator + listings + bids + orders + juror voting + dispute
   evidence) maps module-for-module to Studio 0a0d's 15 commerce
   packages (`order_escrow`, `dispute_quorum`, `manifest_anchor`,
   `reputation`, `review`, `tier`, `milestone_escrow`, `bond`, etc.).
6. Both tokens use 1,337-based max supply (meme-coin / leet
   numerology signature consistent with a single operator).

**Brand names revealed:**
- Marketplace: **CLAWNERA** (previously unknown on-chain)
- Token: **CLAW**
- Launchpad: **SPEC**
- Operator handle: `Moron1337`
- Public presence: **Spec Weekly** YouTube + IOTA Discord
  `#speculations`
- No formal company — reads as a one-person / small community-run
  meme-coin project.

Sales UIs: `https://buy.spec-coin.cc/`, `https://buy.claw-coin.com`.

**Registry impact:** rename `studio-0a0d` → `clawnera` (or
`spec-weekly`); add 2nd deployer `0x4468c8dd…` (currently uncaught);
add project defs for `Clawnera Marketplace` (consider renaming
`Marketplace Escrow` to this), `Spec Launchpad` (expand to catch
`spec_packs`), `Claw`, `SPEC Coin`.

**Status flip:** 🟠 → 🟡/[x]. Remove from `threads.md`'s "stays
until public launch" section — docs + sale sites are already live,
the launch predicate is effectively satisfied.

Full record: `thread-studio-0a0d.md`.

---

# Verification status per team

Each subsection tracks one team (and the project rows it owns). Status
legend:

- **[x] VERIFIED** — a credentialed third party (auditor, IF ecosystem
  page, etc.) explicitly ties the deployer address to the named team.
- **🟡 CIRCUMSTANTIAL** — module-name signature or product-specific
  terminology strongly implies the team, no external signed attestation
  yet, but alternative explanations are implausible.
- **🟠 UNVERIFIED** — no research done beyond registering the deployer
  and reading the module names. Attribution is a working hypothesis.
- **⚫ ANONYMOUS** — deliberately not attributed to a real-world
  identity; the "team name" is a synthetic label (Studio 0x…).

All teams below are deployers + projects registered at
`api/src/ecosystem/teams/**` and `api/src/ecosystem/projects/**`.

## Pools Finance [x] VERIFIED

See the `2026-04-17 — Pools Finance [x] CLOSED` section above for the
full write-up (Zokyo audit + module-name match + on-chain scan
triangulation).

Deployers: `0x519e…800c`, `0xeada…88e7`, `0x2130…3542` (farming).
Projects: Pools Finance (DEX), Pools Farming.

## Virtue Money [x] VERIFIED — but registry has a misattribution (needs fix)

Deployers in the current registry: `0x14ef…c3e0` and `0xf67d…5a12`.

**Real Virtue deployer: `0xf67d…5a12` ONLY.**
**`0x14ef…c3e0` is not Virtue — it belongs to a GMX-style perps protocol, very likely CyberPerp's L1 companion.**

### Public attestation — gold-standard

Virtue publishes their deployed contract addresses directly on
[docs.virtue.money/resources/technical-resources](https://docs.virtue.money/resources/technical-resources):

| Contract       | Address                                                              |
|----------------|----------------------------------------------------------------------|
| Framework      | `0x7400af41a9b9d7e4502bc77991dbd1171f90855564fd28afa172a5057beb083b` |
| VUSD Treasury  | `0xd3b63e603a78786facf65ff22e79701f3e824881a12fa3268d62a75530fe904f` |
| Oracle         | `0x7eebbee92f64ba2912bdbfba1864a362c463879fc5b3eacc735c1dcb255cc2cf` |
| CDP            | `0x34fa327ee4bb581d81d85a8c40b6a6b4260630a0ef663acfe6de0e8ca471dd22` |
| Stability Pool | `0xc7ab9b9353e23c6a3a15181eb51bf7145ddeff1a5642280394cd4d6a0d37d83b` |

Plus an independent MoveBit audit report at
`https://github.com/Virtue-CDP/virtue-audits/blob/main/Virtue-Audit-Movebit-20250710.pdf`:

- Platform: IOTA
- Language: Move
- Source: `github.com/Virtue-CDP/move-contracts`
- Auditor: MoveBit (contact@bitslab.xyz), July 10 2025
- Description: "The project is a lending collateral system"

### On-chain match

All five addresses from Virtue's docs are deployed by `0xf67d…5a12`
(confirmed via `packages.previousTransactionBlock.sender.address`):

- `0x7400af4…083b` (Framework): modules `account, double, float, linked_table`
- `0xd3b63e6…904f` (VUSD Treasury): modules `admin, limited_supply, module_request, vusd` ← **literally ships the VUSD coin type**
- `0x7eebbee…c2cf` (Oracle): modules `aggregater, collector, listing, result`
- `0x34fa327…dd22` (CDP): modules `events, memo, request, response, vault, version, witness`
- `0xc7ab9b9…d83b` (Stability Pool): modules `balance_number, stability_pool`

All 5/5 docs-published addresses match. Plus 31 more packages under
the same deployer (upgrade versions, rule modules like `pyth_rule` /
`cert_rule` / `whitelist_rule`, point/loyalty modules, flashloan
module, incentive-program modules). Total 36 packages, all consistent
with a Virtue-style CDP stablecoin protocol.

### The misattribution — `0x14ef…c3e0` is NOT Virtue

Our current registry has `0x14ef…c3e0` listed as Virtue's main
deployer. It's wrong. That address deploys 11 packages, none of which
are Virtue-like:

- 4 packages with a 19-module GMX-style perpetuals signature:
  `delegates, liquidity_pool, market, price_oracle, pyth, referral,
  rewards_manager, router_delegates, router_liquidity_pool,
  router_price_oracle, router_referral, router_rewards_manager,
  router_trading, router_vault, trading, trading_calc, utils, vault,
  vault_type`. This is textbook GMX-fork terminology — a
  derivatives/perps exchange, not a CDP stablecoin.
- 1 package with a single module named `cyb` — almost certainly the
  CYB coin type (CyberPerp's token).
- 1 OFT wrapper (14 `oft_*` modules) — likely for bridging CYB
  cross-chain via LayerZero.
- 2 DEX/yield-farm packages (`config, router, script, swap, utils,
  yield_farm`).
- 3 standalone `market`-only packages.

CyberPerp is a public IOTA project (see [cyberperp.io](https://cyberperp.io),
[docs.cyberperp.io](https://docs.cyberperp.io),
[defillama.com/protocol/cyberperp](https://defillama.com/protocol/cyberperp)) —
described as a GMX fork deployed on IOTA EVM. Their docs focus
exclusively on the EVM deployment, but these L1 Move packages fit
their product surface and include their CYB token module. Most likely
`0x14ef…c3e0` is CyberPerp's L1 Move companion (perhaps for native
IOTA derivatives or CYB token bridging); less likely, it's an
unrelated GMX fork.

### Why our registry went wrong

The Virtue project match rule is `{liquidity_pool, delegates}`. Both
are in CyberPerp's 19-module package, so our matcher claims those
packages as "Virtue". Virtue does have its own `vault` + `delegates`-
adjacent modules (Virtue's CDP package includes `vault`, and its
incentive-program module list includes `admin_of_incentive`), but
Virtue does NOT use a module named `liquidity_pool` at all — that's a
DEX/perps primitive, not a CDP primitive. The original match rule was
probably authored against CyberPerp's on-chain signature while
misreading it as Virtue's, since the deployer and the rule landed
together.

### Registry corrections needed

1. **Remove** `0x14effa2d3435b7c462a969db6995003cfd3db97f403ad9dd769d0a36413fc3e0`
   from `api/src/ecosystem/teams/defi/virtue.ts` deployers.
2. **Change Virtue's project match** in `api/src/ecosystem/projects/defi/virtue.ts`
   from `{all: ['liquidity_pool', 'delegates']}` to a signature that
   actually matches a Virtue package. Options:
   - `packageAddresses: [five docs-listed addresses]` — hardcoded,
     reliable, won't auto-discover new deploys.
   - Module match: `{all: ['vault', 'flashloan', 'response',
     'witness']}` — matches the CDP package, uniquely Virtue-ish.
   - Module match: `{all: ['admin', 'limited_supply', 'vusd']}` —
     matches the VUSD Treasury package, literal VUSD reference.
   - Cleanest: hardcode `packageAddresses` for the 5 canonical
     Virtue components and split them into one project row each
     (Framework / VUSD Treasury / Oracle / CDP / Stability Pool), the
     way Virtue themselves structure it.
3. **Re-examine Virtue Stability and Virtue Pool project defs.**
   - Virtue Pool (`balance_number`, `stability_pool`) currently
     matches Virtue's Stability Pool package (`0xc7ab9b9…d83b` and
     its upgrade versions, all under `0xf67d…5a12`). So
     "Virtue Pool" is actually Virtue's stability-pool primitive,
     just misnamed.
   - Virtue Stability (`stability_pool`, `borrow_incentive`)
     currently matches ZERO packages. The actual borrow-incentive
     packages have module set `{borrow_incentive, config,
     stability_pool_incentive}` or `{borrow_incentive,
     incentive_config, incentive_events, stability_pool_incentive}` —
     they don't contain `stability_pool` itself. Def is dead weight
     under the current rule; should either be removed or rewritten to
     match the incentive packages.
4. **Decide what to do with `0x14ef…c3e0`'s packages.** Options:
   - Leave unattributed (let them drop out of the L1 list once the
     Virtue rule is corrected).
   - Add a new L1 project for CyberPerp's Move packages and create a
     CyberPerp team. Would mean CyberPerp shows up on both L1 (Move
     activity) and L2 (DefiLlama TVL) — arguably accurate. Needs more
     diligence first to confirm it really is CyberPerp and not a
     similarly-shaped third-party fork.

Proposed action order: fix the registry first (steps 1–3, straightforward),
then triage #4 separately because it requires more research and may
result in a new project definition.

## Swirl [x] VERIFIED

Deployer: `0x043b7d4d89c36bfcd37510aadadb90275622cf603344f39b29648c543742351c`.
Projects: Swirl, Swirl Validator.

### Public attestation — gold-standard

Swirl embeds a Hacken audit report directly in their docs (via
docs.swirlstake.com's audit section). The PDF is at
`https://3016215816-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FabhwBr1MputApDFLHjT8%2Fuploads%2FvigeoQRK0tfHNpJqrp9F%2Fsmart-contract-audit-hacken.pdf`.

Audit front matter:

- **Customer:** ANKR (Ankr's enterprise-services arm, Asphere, is
  publicly identified as Swirl's co-engineer in launch coverage at
  Bitget, CryptoNews, CryptoRank).
- **Internal product name:** "StakeFi" — "a project that implements a
  liquid staking system for IOTA, combining modules for validator
  management, staking operations, mathematical utilities, and a
  reward-bearing CERT token that appreciates in value to reflect
  accumulated staking rewards."
- **Website:** http://swirlstake.com/
- **Platform:** IOTA
- **Language:** Move
- **Tags:** Staking; Incentives; Liquidity Pool
- **Repository:** `github.com/Ankr-network/stakefi-iota-smart-contract`
- **Commit audited:** `e18946f`
- **Remediation commit:** `1541f5d`
- **Auditor:** Hacken OÜ, Tallinn, Estonia
- **Date:** March 25, 2025 (final report)

The chain of branding: Swirl publicly published = StakeFi internally
(Ankr's product codename) = the audited codebase at
`Ankr-network/stakefi-iota-smart-contract`. All three labels are
explicitly bridged by the Hacken report.

### On-chain match

Deployer `0x043b…351c` has published exactly 4 packages, all with
the identical 2-module signature:

- `0x33bb7e4d…abd5` — modules `pool, riota`
- `0xb2664e27…accf3` — modules `pool, riota`
- `0x2a3e5036…4dcd` — modules `pool, riota`
- `0x14beb992…a581` — modules `pool, riota`

Four upgrade versions of the same two-module liquid-staking package.
- `pool` is Swirl's NativePool / liquidity-pool primitive (per the
  audit tags: "Liquidity Pool") — where IOTA gets staked.
- `riota` is Swirl's receipt-token type (a.k.a. "rIOTA" / the CERT
  token Hacken describes as "reward-bearing"; Swirl's public branding
  surfaces it as stIOTA to users).

No other Move package on IOTA mainnet contains this exact `{pool,
riota}` module pair. Deployer has zero off-topic packages. Perfectly
clean footprint for a single-product team.

### Triangulation

- [x] Swirl's docs link to the Hacken audit as their official security
  review.
- [x] Hacken names Ankr as the customer and "StakeFi ... liquid staking
  system for IOTA" as the audited product.
- [x] Press coverage (Bitget, CryptoNews) confirms Ankr's Asphere
  co-engineers Swirl.
- [x] Swirl is the only liquid-staking protocol on IOTA (per IOTA's
  ecosystem listings and Swirl's own "first" claim).
- [x] On-chain scan: exactly one deployer on mainnet publishes packages
  with the `{pool, riota}` signature.

Attribution conclusive.

### Separate project def — "Swirl Validator" is dead weight

The Swirl Validator project def (`match: {all: ['cert', 'native_pool',
'validator']}`, `teamId: 'swirl'`) was intended to capture Swirl's
validator-management contracts. Follow-up scan of all ~747 mainnet
packages confirms **zero packages on IOTA mainnet contain all three
modules `cert` + `native_pool` + `validator`**. The def matches
nothing. Also cross-checked against the live ecosystem snapshot —
"Swirl Validator" is not one of the 52 project rows currently in
the DB.

This mirrors the "Virtue Stability" situation: a def was authored
against an anticipated module layout that either never shipped or
got refactored away.

Action: either remove the `swirlValidator` project definition from
`api/src/ecosystem/projects/defi/swirl.ts` and `ALL_PROJECTS` in
`api/src/ecosystem/projects/index.ts`, or rewrite the match rule if
we can find the real validator-management package (not apparent on
mainnet today — possibly not deployed yet, or merged into the main
`{pool, riota}` package).

## iBTC / Echo Protocol [x] VERIFIED — but registry uses misleading name

Deployer: `0x95ec54247e108d3a15be965c5723fee29de62ab445c002fc1b8a48bfc6fb281e`.
Project: iBTC Bridge.

**iBTC is not a standalone project — it's a bridged-Bitcoin token
(`ibtc.move`) minted by Echo Protocol's IOTA bridge.** Echo Protocol
is the real team; iBTC is one of several bridged assets within their
multi-module bridge package.

### Public attestation — gold-standard

Hacken audited Echo Protocol's IOTA bridge in July/August 2025,
published at `https://hacken.io/audits/echo-protocol/sca-echo-protocol-bridge-iota-jul2025/`:

- **Customer:** Echo Protocol
- **Repository:** `github.com/echo-proto/bridge-iota`
- **Audited commits:** initial `686e118`, final `89ffe353`
- **Date:** August 28, 2025
- **Platform:** Move (IOTA) — explicitly noting "The EVM-side bridge
  logic was not part of the review"
- **Audited modules:** `bridge.move`, `chain_ids.move`,
  `committee.move`, `crypto.move`, **`ibtc.move`**, `limiter.move`,
  `message.move`, `message_types.move`, `treasury.move`

Echo Protocol is the same Bitcoin liquidity & aggregation
infrastructure that also operates on Aptos (BTCFi platform). Their
IOTA integration ships iBTC as "the first native Bitcoin asset
within the IOTA ecosystem" (per IOTA blog coverage).

### On-chain match

Deployer `0x95ec…281e` publishes 5 upgrade versions, all with the
identical 9-module signature:

- `0x387c459c…25b54` — 9 modules: `bridge, chain_ids, committee,
  crypto, ibtc, limiter, message, message_types, treasury`
- `0xc764ca3e…4962ba` — same 9 modules
- `0xf88f24da…65fa6c` — same 9 modules
- `0xcf40230e…083b319` — same 9 modules
- `0x646ebba1…670673` — same 9 modules

**Exact 9-for-9 match with Hacken's audit scope.** No other deployer
on IOTA mainnet ships packages with this signature.

### Triangulation

- [x] Hacken audit names Echo Protocol as the customer.
- [x] Audit names exactly 9 Move module files in scope.
- [x] Mainnet shows exactly one deployer (`0x95ec…281e`) publishing
  packages with that exact 9-module set; five upgrade versions over
  time.
- [x] IOTA blog and news coverage (CryptoNews, CryptoNewsFocus, MEXC,
  Bitget) confirm Echo Protocol is the BTC-bridge provider for IOTA.

Attribution conclusive.

### Registry actions needed

Current registry labels this deployer as team **"iBTC"** (`teams/bridges/ibtc.ts`)
and the project as **"iBTC Bridge"** (`projects/bridges/ibtc-bridge.ts`).
Both names understate what the team actually ships — it's Echo
Protocol running a multi-asset bridge whose first product happens to
be iBTC.

Recommendations:

1. **Rename team `iBTC` → `Echo Protocol`** in
   `api/src/ecosystem/teams/bridges/ibtc.ts`:
   - `id: 'echo-protocol'` (was `ibtc`)
   - `name: 'Echo Protocol'` (was `iBTC`)
   - `urls: [{label: 'Website', href: 'https://echo-protocol.xyz'}]`
     (note: confirm actual URL before adding; Echo's Aptos BTCFi
     page may have the canonical link)
   - `deployers`: unchanged
   - `attribution`: the writeup above.
   - File rename: `ibtc.ts` → `echo-protocol.ts` for clarity
     (optional; id change is what matters).

2. **Rename project `iBTC Bridge` → `Echo Protocol Bridge`** in
   `api/src/ecosystem/projects/bridges/ibtc-bridge.ts`:
   - `name: 'Echo Protocol Bridge'` (was `iBTC Bridge`)
   - Update `teamId` to `'echo-protocol'`
   - Match rule is already adequate (`{all: ['ibtc', 'bridge']}`).
     Could tighten to `{all: ['bridge', 'committee', 'ibtc',
     'treasury']}` for extra specificity, since the 9-module
     signature is distinct enough that a 4-module subset is
     effectively unique on IOTA.
   - Optional: add a `disclaimer` field explaining that iBTC is one
     of several assets this bridge mints, so users don't expect
     iBTC-only activity.

3. Update `project-mapping.md` to reflect the renamed project and
   team, and add a row in the Trade/Bridges section referencing the
   Hacken attestation.

## LayerZero [x] VERIFIED — but registry undercounts heavily

Deployer: `0x8a81a6096a81fe2b722541bc19eb30e6c025732638375c362f07ea48979fd30a`.
Projects: LayerZero (core endpoint). LayerZero OFT is a separate
aggregate bucket — see its own section below.

### Public attestation — gold-standard

LayerZero's **own metadata API** publishes their IOTA L1 mainnet
deployment at
`https://metadata.layerzero-api.com/v1/metadata/deployments`, under
chain key `iotal1-mainnet`:

```json
{
  "eid": "30423",
  "chainKey": "iotal1",
  "chainType": "iotamove",
  "chainLayer": "L1",
  "chainStatus": "ACTIVE",
  "stage": "mainnet",
  "endpointV2":    { "address": "0xb8e0cd76cb8916c48c03320e43d46c3775edd6f17ce7fbfad6c751289dcb1735" },
  "sendUln302":    { "address": "0x042e3bb837e5528e495124542495b9df5016acd011d89838ae529db5a814499e" },
  "receiveUln302": { "address": "0x042e3bb837e5528e495124542495b9df5016acd011d89838ae529db5a814499e" },
  "executor":      { "address": "0x29b691f9496eea6df8f4d77ceacee5949e92e7e51b2e3c2e6cd70eef5237e99a" },
  "version": 2
}
```

Plus the human-readable chain page at `https://docs.layerzero.network/v2/deployments/chains/iota-l1`
(eid 30423, explicitly describing IOTA L1 as a Move-based deployment
"separate from IOTA EVM L2, EID 30284"), and the IOTA-L1 developer
overview at `https://docs.layerzero.network/v2/developers/iota/overview`.

### On-chain match

Deployer `0x8a81…d30a` publishes **22 packages**, every one of which
is a LayerZero V2 component. The two concrete-addressable components
from LayerZero's metadata API both land exactly here:

- **endpointV2** `0xb8e0cd76…dcb1735` → on-chain package with modules
  `endpoint_quote, endpoint_send, endpoint_v2, lz_compose, lz_receive,
  message_lib_manager, message_lib_quote, message_lib_send,
  message_lib_set_config, message_lib_type, messaging_channel,
  messaging_composer, messaging_fee, messaging_receipt,
  oapp_registry, outbound_packet, timeout, utils`. **Exact match.**
- **sendUln302 / receiveUln302** `0x042e3bb8…a814499e` → on-chain
  package with modules `executor_config, oapp_uln_config, receive_uln,
  send_uln, uln_302, uln_config`. **Exact match.**

The executor address `0x29b691f9…37e99a` is an operational account,
not a package deployer (confirmed via `packages(…)` query: zero
packages at that address). That's consistent with LayerZero's
architecture where the Executor is an off-chain worker identity.

The remaining 20 packages at `0x8a81…d30a` are LayerZero V2 support
infrastructure, all with on-brand module names:

- **ZRO token** (`zro` module): `0xed5b4c39…f05698`
- **Call pattern primitives** (LayerZero's Move-specific IPC): `call`,
  `call_cap`, `multi_call`, `argument`, `function`, `move_call`,
  `move_calls_builder`
- **Workers / DVN / Executor infra**: `dvn_assign_job`, `dvn_get_fee`,
  `dvn_verify`, `executor_assign_job`, `executor_get_fee`,
  `worker_registry`, `worker_common`, `worker_info_v1`,
  `fee_recipient`, `packet_v1_codec`, `worker_options`
- **Message libraries**: `simple_message_lib`, `blocked_message_lib`
- **PTB builders** (for LayerZero's Programmable Transaction Block
  construction on Move): `endpoint_ptb_builder`,
  `uln_302_ptb_builder`, `simple_msglib_ptb_builder`,
  `blocked_msglib_ptb_builder`, `set_worker_ptb`,
  `msglib_ptb_builder_info`
- **OApp framework**: `endpoint_calls`, `enforced_options`, `oapp`,
  `oapp_info_v1`, `oapp_peer`, `ptb_builder_helper`
- **View packages**: `endpoint_views`, `uln_302_views`
- **Utilities**: `buffer_reader, buffer_writer, bytes32, hash,
  package, table_ext`, `estimate_fee`, `package_whitelist_validator`

These are LayerZero-V2-on-Move textbook module names (confirmed
against [LayerZero's IOTA L1 developer overview](https://docs.layerzero.network/v2/developers/iota/overview),
which describes "Programmable Transaction Blocks (PTBs) and the Call
pattern" — exactly matching the PTB-builder and Call-cap modules we
see on-chain).

### Triangulation

- [x] LayerZero's own metadata API names `iotal1-mainnet` with eid
  30423, chainLayer L1, chainType iotamove.
- [x] The API publishes 3 addressable package components
  (endpointV2 + sendUln302/receiveUln302 pointing at the same ULN
  package + executor as an account).
- [x] Our on-chain scan confirms 2 of the 3 API-published addresses
  are at deployer `0x8a81…d30a`; the 3rd is an account (non-package).
- [x] 22 packages total at this deployer, all LayerZero V2 components
  with matching module names.
- [x] Zero off-topic packages at this deployer; no LayerZero-adjacent
  modules (`messagelib`, `endpoint`, `lz_compose`) appear at any
  other deployer on IOTA mainnet.

Attribution conclusive.

### Registry undercoverage — worth fixing

Our current project match for LayerZero is
`any: ['endpoint_quote', 'lz_compose']`. On-chain this matches
**exactly 1 package** out of the 22 LayerZero has deployed (the
18-module EndpointV2 package). The other 21 LayerZero packages —
ZRO token, ULN302, executor/DVN workers, PTB builders, OApp
framework — never enter our registry as LayerZero, so their events
and storage don't count toward the LayerZero row on the site.

Options to fix:

1. **Hardcode `packageAddresses`** with all 22 addresses from the
   on-chain scan. Accurate but brittle (a new LayerZero deployment
   won't auto-appear until we add its address).
2. **Match by deployer.** Add a new rule type (`deployerAddresses`)
   so any package from `0x8a81…d30a` counts as LayerZero. Auto-picks
   up future deploys. Requires a small scanner extension.
3. **Broader module match.** E.g.
   `any: ['endpoint_v2', 'lz_compose', 'oapp', 'uln_302', 'zro',
   'oapp_registry', 'messaging_channel']`. Picks up the core packages
   without hardcoding addresses, but may false-positive on OApp token
   wrappers deployed by other teams (Virtue's wOFT, iBTC's bridge
   uses `message` modules, etc.).
4. **Split into sub-projects**, each matching one LayerZero
   sub-system by its distinctive module. E.g. "LayerZero Endpoint",
   "LayerZero ULN", "LayerZero ZRO", "LayerZero Workers",
   "LayerZero OApp Framework". Pros: granular per-component activity
   tracking. Cons: adds many rows.

For now the entry is [x] verified; the registry just counts too
little activity toward it. Decision on which fix to apply is a UX
call — is LayerZero one row or many? Likely one umbrella with
aggregated events makes most sense.

## Wormhole Foundation [x] VERIFIED (Wormhole + Pyth, shared deployer)

Deployer: `0x610a7c8f0e7cb73d3c93d1b4919de1b76fc30a8efa8e967ccdbb1f7862ee6d27`.
Projects: Wormhole, Pyth Oracle.

### Public attestation — gold-standard

Pyth Network's official IOTA deployment page
([docs.pyth.network/price-feeds/contract-addresses/iota](https://docs.pyth.network/price-feeds/contract-addresses/iota))
publishes both IOTA mainnet package addresses verbatim:

- **Wormhole Package ID** (Move package): `0x88b00a6f1d56966d48680ffad3b42d7a25b01c519b73732a0858e0314a960801`
- **Wormhole State ID** (shared Move object): `0xd43b448afc9dd01deb18273ec39d8f27ddd4dd46b0922383874331771b70df73`
- **Pyth Package ID** (Move package): `0x7792c84e1f8683dac893126712f7cf3ba5fcc82450839f0a481215f60199769f`
- **Pyth State ID** (shared Move object): `0x6bc33855c7675e006f55609f61eebb1c8a104d8973a698ee9efd3127c210b37f`

The state objects (long-lived on-chain state for each contract) are
different addresses than the packages (immutable bytecode). We track
packages; state objects aren't part of the scanner's scope but are
included here for completeness.

Notably, Wormhole's own main contract-addresses reference page
([wormhole.com/docs/products/reference/contract-addresses](https://wormhole.com/docs/products/reference/contract-addresses/))
does not list IOTA at all (50+ other chains listed). Their IOTA
integration exists but is documented on Pyth's side — the Wormhole
Foundation runs both contracts from the same deployer because Pyth's
price feeds ride on top of Wormhole's VAA messaging layer.

### On-chain match

Deployer `0x610a…6d27` publishes exactly **2 packages**, one per
product, no upgrade versions observed yet (deployments are single
v1 packages — could change):

- `0x88b00a6f…960801` — **Wormhole Core Contract**, 20 modules:
  `bytes, bytes20, bytes32, consumed_vaas, cursor, emitter,
  external_address, fee_collector, governance_message, guardian,
  guardian_set, guardian_signature, migrate, package_utils,
  publish_message, set, set_fee, setup, state, transfer_fee`.
  Textbook Wormhole Core — the `guardian`, `guardian_set`,
  `guardian_signature`, and `publish_message` modules are the
  defining primitives of Wormhole's guardian-based attestation
  protocol.
- `0x7792c84e…199769f` — **Pyth Oracle**, 20 modules: `accumulator,
  batch_price_attestation, contract_upgrade, data_source,
  deserialize, event, governance, governance_action,
  governance_instruction, hot_potato_vector, i64, merkle_tree,
  migrate, price, price_feed, price_identifier, price_info,
  price_status, pyth, set`. Textbook Pyth on-chain contract
  (`batch_price_attestation` + `merkle_tree` + `price_feed` is
  Pyth's pull-oracle architecture).

Both package addresses **exactly match** Pyth's official docs.

### Triangulation

- [x] Pyth's official docs publish both the Wormhole Core and Pyth
  package addresses verbatim.
- [x] On-chain scan confirms both packages exist at deployer
  `0x610a…6d27`.
- [x] Module signatures are unambiguous (guardian-based cross-chain
  messaging for Wormhole, merkle-tree batch price attestation for
  Pyth).
- [x] Shared deployer is architecturally expected: Pyth's pull-oracle
  design broadcasts price updates via Wormhole VAAs, so whoever
  operates Wormhole on IOTA is the natural operator for Pyth's
  integration.
- [x] No other deployer on mainnet has either module signature.

Attribution conclusive.

### Side-finding — `pyth` module as false signal

CyberPerp's main trading deployer (`0x14ef…c3e0`, see separate
section) publishes 4 packages each containing a module literally
named `pyth`. Those are CyberPerp's **client-side Pyth price-feed
integration** (trading engines embed a consumer of Pyth's oracle),
not Pyth's oracle contract itself. Our Pyth match rule
`{all: ['batch_price_attestation']}` correctly disambiguates — the
client-side `pyth` modules don't carry `batch_price_attestation`.
Worth noting for anyone tempted to loosen the rule to just `pyth`.

### Registry adequacy

Current match rules are both correct and precise:
- Wormhole: `{all: ['consumed_vaas', 'cursor']}` — matches 1/1
  package (the Wormhole Core).
- Pyth: `{all: ['batch_price_attestation']}` — matches 1/1 package
  (the Pyth Oracle).

No undercounting (as with LayerZero) — each product is a single
package and our rule catches it. If/when Wormhole or Pyth ship
upgrade versions, the matchers will auto-discover them from the
same deployer so long as the module signatures remain stable.

## Switchboard [x] VERIFIED

Deployer: `0x55f1256ec64d7c4eacb1a5e24932b9face3cdf9400f8d828001b2da0494e7404`.
Project: Switchboard Oracle.

### Public attestation — gold-standard

Switchboard's official IOTA documentation at
[docs.switchboard.xyz/docs-by-chain/iota](https://docs.switchboard.xyz/docs-by-chain/iota)
publishes the mainnet package address verbatim:

> "Switchboard On-Demand service is currently deployed on the
> following networks:
> **Mainnet:** `0x8650249db8ffcffe8eb08b0696a8cb71e325f2afb9abc646f45344077b073ba1`"

They also reference their IOTA-specific GitHub repo at
[github.com/switchboard-xyz/iota](https://github.com/switchboard-xyz/iota)
(used as a Move.toml dependency). No audit is linked from their IOTA
docs page; Switchboard runs on many chains and their cross-chain
audit history lives elsewhere.

### On-chain match

Deployer `0x55f1…7404` has published exactly **1 package** matching
their documented address:

- `0x8650249d…b073ba1` — 20 modules: `aggregator,
  aggregator_delete_action, aggregator_init_action,
  aggregator_set_authority_action, aggregator_set_configs_action,
  aggregator_submit_result_action, decimal,
  guardian_queue_init_action, hash, on_demand, oracle,
  oracle_attest_action, oracle_init_action,
  oracle_queue_init_action, queue, queue_add_fee_coin_action,
  queue_override_oracle_action, queue_remove_fee_coin_action,
  queue_set_authority_action, queue_set_configs_action`.

This is textbook Switchboard On-Demand architecture —
aggregator/oracle/queue primitives with explicit init/config
actions. The `on_demand` module name is literal branding for
Switchboard's "On-Demand" product line.

### Triangulation

- [x] Switchboard's docs publish package `0x8650249d…b073ba1` as
  their IOTA Mainnet deployment.
- [x] Our on-chain scan confirms exactly that package exists at
  deployer `0x55f1…7404`.
- [x] 20-module signature is unambiguously Switchboard On-Demand.
- [x] No other mainnet deployer ships an `aggregator` module on IOTA.

Attribution conclusive.

### Registry adequacy

Current match rule is
`{all: ['aggregator', 'aggregator_init_action'], minModules: 10}`.
On-chain it matches 1/1 package — full coverage. The `minModules: 10`
guard is good defensive tuning: the module name `aggregator` is
generic enough that without the `minModules` floor, a small
one-module `aggregator` helper from another team could false-match.
With the 10-module floor, only Switchboard's production on-demand
package (20 modules) fits.

Rule is fine as-is.

## Tradeport [x] VERIFIED — but registry undercounts (7 of 15 packages uncaptured)

Deployers:
- `0x20d666d8e759b3c0c3a094c2bac81794e437775c7e4d3d6fe33761ae063385f7` (12 packages)
- `0xae24ce73cd653c8199bc24afddc0c4ddbf0e9901d504c3b41066a6a396e8bf1e` (3 packages)

Projects: Tradeport (marketplace), NFT Launchpad.

### Public attestation — strong

No single page publishes a package address directly (Tradeport's
developer docs return 404, and their IOTA launch blog post describes
the integration without listing addresses). But the organizational
attestation is solid:

- **Tradeport's own blog** announces the IOTA integration:
  [tradeport.xyz/blog/tradeport-now-supports-iota-a-new-era-for-onchain-innovation](https://www.tradeport.xyz/blog/tradeport-now-supports-iota-a-new-era-for-onchain-innovation).
- **Aptos docs reference Tradeport's Aptos deployment** at
  [aptos.dev/build/indexer/nft-aggregator/marketplaces/tradeport](https://aptos.dev/build/indexer/nft-aggregator/marketplaces/tradeport)
  with the same product architecture (V1 `biddings`+`listings`, V2
  `biddings_v2`+`listings_v2`). This cross-chain consistency
  confirms the IOTA deployment is the same team's port — same
  marketplace conventions, adapted to IOTA Move's native Kiosk
  primitive.

### On-chain match

Deployer `0x20d6…85f7` (12 packages):

- 3 upgrade versions with a single `tradeport_biddings` module — the
  marketplace bidding primitive (brand literal).
- 3 upgrade versions with `launchpad, mint_box, pseudorandom,
  signature` — the NFT Launchpad product (pseudorandom minting +
  signature-based whitelist).
- 2 versions with `kiosk_listings` (Kiosk-based listings).
- 2 versions with `kiosk_transfers` (Kiosk-based transfers).
- 2 versions with a `listings` module (plain listings — same name
  as Aptos V1 Tradeport's `listings` module).

Deployer `0xae24…bf1e` (3 packages):

- 1 with `launchpad, mint_box, pseudorandom, signature` (same
  signature as the main launchpad — this deployer also ships the
  launchpad product).
- 1 with 6 modules: `floor_price_rule, kiosk_lock_rule,
  personal_kiosk, personal_kiosk_rule, royalty_rule, witness_rule`
  — transfer-policy rules for the Kiosk standard (royalty
  enforcement, floor price, personal-kiosk lock, witness-based
  auth). IOTA Move uses these rules to enforce marketplace fees and
  per-collection policies.
- 1 with a single `nft_type` module — a shared NFT type package.

Every package fits a comprehensive NFT marketplace stack. Zero
off-topic deployments.

### Triangulation

- [x] Tradeport publicly announces IOTA deployment.
- [x] Cross-chain code structure (Aptos Tradeport uses same
  biddings/listings architecture) confirms same team is behind both
  deployments.
- [x] The module name `tradeport_biddings` is literally the
  organization's brand baked into the identifier.
- [x] On-chain scan shows exactly two closely-related deployers
  covering marketplace bidding + listings + kiosk integration +
  launchpad + transfer policy rules — a complete multi-product NFT
  marketplace stack.
- [x] No other IOTA mainnet deployer ships `tradeport_biddings`,
  `launchpad+mint_box`, or the multi-module kiosk transfer policy
  rule package.

Attribution conclusive.

### Registry undercoverage

Current registry captures only 2 product lines:

- **Tradeport** (match `tradeport_biddings`) — 3 of 15 packages.
- **NFT Launchpad** (match `launchpad + mint_box`) — 4 of 15 packages.

**7 packages aren't attributed as Tradeport:**

- 2 `kiosk_listings` packages
- 2 `kiosk_transfers` packages
- 2 standalone `listings` packages
- 1 transfer-policy-rules package (6 modules — royalty/floor/kiosk
  lock rules)
- 1 `nft_type` package

Impact: events/storage from these 7 packages aren't counted toward
the Tradeport row on the site. Since kiosk-based trades are probably
a meaningful share of Tradeport's on-chain activity, this is a
non-trivial undercount.

Options to fix:

1. **Add product-specific projects** for each module signature:
   - "Tradeport Kiosk" → match `any: ['kiosk_listings',
     'kiosk_transfers']`, `teamId: 'tradeport'`.
   - "Tradeport Listings" → match `exact: ['listings']`, `teamId:
     'tradeport'`. Caution: single-module generic name; may
     false-match — verify it's Tradeport-specific before shipping
     (module `listings` also appears on Aptos Tradeport V1, so the
     name is theirs, but a defense against false positives would
     still be prudent).
   - "Tradeport Transfer Policies" → match `all: ['royalty_rule',
     'kiosk_lock_rule', 'personal_kiosk']`, `teamId: 'tradeport'`.
2. **Or: introduce a `deployerAddresses` match rule type** for
   teams like Tradeport where all packages from certain addresses
   belong to that team regardless of module signature. Cleaner
   long-term solution; needs a small scanner change.
3. **Or: keep the current two products and accept the undercount.**
   Each sub-product has distinct activity we're losing; not ideal
   but not catastrophic.

## Salus Platform [x] VERIFIED — textbook fingerprint-rule case

Deployer: `0x4876d3fca2cb61ce39d4f920ad0705f5921995642c69201ee5adfa8f94c34225`.
Project: Salus Platform.

### Public attestation — strong organization-level + Move-object self-attestation

No single source publishes the specific package address the way
Virtue's or Switchboard's docs do, but the chain of evidence is
comprehensive:

- **IOTA Foundation endorsement:** IOTA's Technology Showcase has a
  dedicated [Salus page](https://www.iota.org/learn/showcases/salus)
  and a feature blog post at
  [blog.iota.org/trade-finance-reinvented](https://blog.iota.org/trade-finance-reinvented/).
- **IOTA-Salus partnership coverage:** Bitget, CoinTrust, ChainCatcher,
  Blockchain.News, MEXC, and RootData all published launch coverage
  describing Salus tokenizing Digital Warehouse Receipts (DWRs) and
  Bills of Lading as IOTA NFTs for critical-mineral supply chains.
- **Salus Platform's own site** ([salusplatform.com](https://salusplatform.com))
  describes the product — minerals-focused trade-finance platform
  built on IOTA.
- **Visual attestation:** Salus publishes images of their on-chain
  NFTs (the DWR receipts) on their X/Twitter account. Anyone can
  cross-check a shown NFT's address against the scanner's
  `0x4876…c34225` deployer.
- **On-chain self-attestation:** every Move object of type
  `<pkg>::nft::NFT` minted by Salus contains `issuer` and `tag`
  fields populated with `0x4876…c34225` and `"salus"` respectively —
  the contract writes its own identity into each minted token.

### On-chain match

Scan of deployer `0x4876…c34225` reveals **60 distinct package
addresses**, all with a single module named `nft`. Unusual pattern:
rather than one package upgraded 60 times (which would preserve the
original address with version bumps), Salus publishes a *new*
package per batch of DWRs. The registry's `packageAddresses` hardcode
of one specific address (`0xf5e4f559…a90f`) catches that one
instance; everything else is rescued via the fingerprint rule.

Fingerprint probe verified live: sampled a Move object of type
`0xf5e4f559…::nft::NFT` and found the expected fields populated:

```
id:               0x59e6523564f5d7…
issuer:           0x4876d3fca2cb61ce39d4f920ad0705f5921995642c69201ee5adfa8f94c34225
tag:              "salus"
immutable_metadata, metadata, issuerIdentity, ownerIdentity: (populated)
```

All 60 packages from this deployer successfully attribute to Salus in
the live snapshot — confirmed against `/api/v1/ecosystem` which
reports `packages: 60` for the Salus Platform row, with 0 events
(Salus's `nft` module mints objects but doesn't emit custom events —
normal for Move NFT contracts that rely on object creation as the
implicit event).

### Triangulation

- [x] IOTA Foundation's own showcase page endorses Salus as an IOTA
  partner.
- [x] Multiple independent news outlets published the Salus-on-IOTA
  launch story.
- [x] Fingerprint probe confirms each Salus-minted NFT carries
  self-attestation linking the token to the deployer address
  `0x4876…c34225`.
- [x] 60 packages, all same single-module `nft` pattern, all same
  deployer, all with matching fingerprint.
- [x] No other deployer on IOTA mainnet mints NFT objects with
  `issuer=0x4876…c34225` and `tag="salus"`.

Attribution conclusive. This is a textbook case for why the
fingerprint rule exists — Salus iterates fast enough that
`packageAddresses` alone would rot, but the fingerprint auto-
discovers every new mint.

### Registry adequacy

Current rule:

```ts
packageAddresses: ['0xf5e4f55993ef59fe3b61da5e054ea2a060cd78e34ca47506486ac8a7c9c7a90f'],
fingerprint: {
  type: 'nft::NFT',
  issuer: '0x4876d3fca2cb61ce39d4f920ad0705f5921995642c69201ee5adfa8f94c34225',
  tag: 'salus',
},
```

Both legs working. The hardcoded address is technically redundant
(fingerprint would catch it) but serves as a canonical pointer, and
it also ensures attribution if someone ever queries an NFT-less
instance of that package (fingerprint requires a live minted object
to probe).

Rule is fine as-is. The one micro-nit: the hardcoded `packageAddresses`
could be dropped, but there's no functional downside to keeping it.

### Open question about the 60-package pattern

Not a verification issue, but worth a footnote: why does Salus
deploy a *new* package per batch instead of upgrading one? Possible
explanations:
- Each batch represents a distinct legal trade instrument (one DWR
  per package), and Salus uses the package-address distinction as
  an on-chain namespace.
- Publishing is cheaper than upgrading for very small packages, and
  they don't need upgrade history.
- A regulatory/provenance reason — separate packages give isolated
  audit trails per trade.

None of these affect attribution. Each new package still carries the
Salus issuer tag, so the fingerprint keeps finding them.

## IOTA Foundation — Chain Primitives + Identity [x] VERIFIED

Attribution for the IF-consolidated team (`iota-foundation`):
deployers as documented in
`api/src/ecosystem/teams/misc/iota-foundation.ts`. Chain primitives
(`0x2`, `0x3`) are genesis-installed system packages on IOTA
Rebased — attribution is the chain protocol itself. IOTA Foundation
is the only possible operator.

Product-line deployers (identity / notarization / traceability) are
documented individually below. Each has its own product page on
iota.org and an iotaledger GitHub repo. The chain-primitives and
identity stack are [x] on organizational grounds; Notarization and
Traceability additionally have direct iotaledger-github-org
attestation.

## IOTA Identity stack [x] VERIFIED — registry captures most but not all

Deployer: `0x45745c3d1ef637cb8c920e2bbc8b05ae2f8dbeb28fd6fb601aea92a31f35408f`.
Projects: Identity (full), Identity (WoT), Credentials.

### Public attestation

IOTA Foundation publishes the Identity product at
[iota.org/products/identity](https://www.iota.org/products/identity),
with the reference implementation hosted under
[github.com/iotaledger/identity](https://github.com/iotaledger/identity)
("Implementation of the Decentralized Identity standards such as DID
and Verifiable Credentials by W3C for the IOTA MoveVM.").

### On-chain match — **24 packages** at this single deployer

Much broader than the 3 product rows we currently ship. Breakdown:

- **Credentials-exact** (`{credentials, identity, trust}` exact set)
  — 2 packages. Matches our `Credentials` rule.
- **Health-lab credentials** (`{credentials, health_lab_simple,
  identity, trust}`) — 1 package. **Currently uncaptured** —
  falls through to Identity (WoT) via `{wot_identity, wot_trust}`?
  Actually no — this package doesn't have `wot_identity`, so it's
  completely unattributed. A specialized credential flavor (health
  lab setting).
- **wot_individual_profile** (`{wot_individual_profile, wot_trust}`)
  — 1 package. **Currently uncaptured** — doesn't contain
  `wot_identity`.
- **WoT-basic** (`{wot_identity, wot_trust}`) — 6 upgrade versions.
  Matches Identity (WoT) rule.
- **WoT + identity_registry** (`{identity_registry, wot_identity,
  wot_trust}`) — 4 versions.
- **WoT + wot_identity_registry** (`{wot_identity,
  wot_identity_registry, wot_trust}`) — 4 versions.
- **WoT + mailbox**
  (`{mailbox, wot_identity, wot_identity_registry, wot_trust}`)
  — 6 versions.
- **Full Identity stack** (`{file_vault, mailbox, wot_identity,
  wot_identity_registry, wot_trust}`) — 2 versions. Matches our
  Identity (full) rule (though our rule looks for `wot_identity +
  file_vault + mailbox` which catches these 2).

### Registry adequacy — small undercount

Our rules claim ~22 of 24 packages:
- Identity (full): 2 (latest mailbox+vault versions)
- Identity (WoT): 20 (every package containing both
  `wot_identity` + `wot_trust`)
- Credentials: 2 (exact set)

**Uncaptured:**
- 1 package with `{credentials, health_lab_simple, identity, trust}`
  (a specialized health-lab credential variant).
- 1 package with `{wot_individual_profile, wot_trust}` (individual
  WoT profile — uses `wot_individual_profile` not `wot_identity`).

Both are minor and isolated. Low-priority improvement would add a
loose `IOTA Identity (misc)` bucket that catches `credentials` or
`wot_*` modules not caught by the three primary rules.

### Attribution

Direct: IOTA Foundation's iotaledger GitHub org operates the repo,
their product site endorses the product, and this is the only
deployer on IOTA mainnet shipping `wot_identity`, `credentials`, or
`identity_registry` modules. Attribution conclusive at [x].

## IOTA Notarization [x] VERIFIED

Deployers:
- `0x56afb2eded3fb2cdb73f63f31d0d979c1527804144eb682c142eb93d43786c8f` (4 packages)
- `0xedb0c77b6393a11b4c29b7914410e468680e3bc8110e99a40c203038c9335fc2` (1 package)

Project: Notarization (`teamId: 'iota-foundation'`).

### Public attestation — gold-standard via iotaledger org

- **Product page:** [iota.org/products/notarization](https://www.iota.org/products/notarization)
  — "Verifiable, Immutable and Flexible On-Chain Records for Any Use
  Case."
- **Source repo (iotaledger GitHub org):**
  [github.com/iotaledger/notarization](https://github.com/iotaledger/notarization/tree/main/notarization-move)
  — "Notarization modules built on MoveVM."

Since `iotaledger` is IOTA Foundation's canonical GitHub
organization, attribution is institutional-grade.

### On-chain match

Deployer `0x56af…6c8f` (4 packages):

- `0x909ce9dc…84cf3` — **the core Notarization package**, 5 modules:
  `{dynamic_notarization, locked_notarization, method, notarization,
  timelock}`. `dynamic_notarization` + `locked_notarization` are IOTA
  Foundation's documented notarization flavors (mutable vs. locked
  on-chain records with optional timelocks) — exact match to the
  product surface at iota.org/products/notarization.
- `0x84cf5d12…1de08` — 16-module package around Identity/Asset
  governance: `{asset, borrow_proposal, config_proposal, controller,
  controller_proposal, delete_proposal, identity, migration,
  migration_registry, multicontroller, permissions, public_vc,
  transfer_proposal, update_value_proposal, upgrade_proposal,
  utils}`. This is actually the **IOTA Identity Asset framework**
  (governance-over-on-chain-assets, multi-controller pattern) —
  possibly co-located here because notarized records are treated as
  identity-assetized objects.
- `0x36d0d56a…78767` — 17-module package, same as above + an
  `access_sub_entity_proposal` module. Upgrade version.
- `0x0f75165f…6d371` — 7-module package: `{accreditation, main,
  property, property_name, property_shape, property_value, utils}`.
  An **accreditation/property registry** — credential-issuer-style
  on-chain attestations, likely used alongside notarization.

Deployer `0xedb0…5fc2` (1 package):

- `0x9b248a26…9ddc5` — same 5-module notarization core signature as
  `0x909ce9dc…`. Upgrade version or redeploy from a second deployer.

### Registry adequacy

Current rule `{all: ['dynamic_notarization']}` matches 2 packages
(the core notarization package, one at each deployer — 2 of 5
total).

**3 uncaptured packages:**
- 2 Identity/Asset framework packages (16 and 17 modules) — arguably
  a different product ("IOTA Identity Asset Framework" or similar)
  that was co-deployed with notarization.
- 1 accreditation/property registry package.

Options to fix:
1. **Leave as-is.** The current rule catches the canonical
   notarization contract; the adjacent packages are arguably
   separate products that deserve their own rows.
2. **Add new project defs** for the adjacent packages:
   - "IOTA Identity Asset Framework" → `{all: ['asset',
     'multicontroller', 'controller_proposal']}` catches the 16/17
     module packages.
   - "IOTA Accreditation Registry" → `{all: ['accreditation',
     'property', 'property_value']}` catches the 7-module package.

Worth doing since the Asset Framework and Accreditation packages
are distinct IOTA Foundation products that currently don't appear
on the site at all.

### Triangulation

- [x] IOTA Foundation's product page + iotaledger GitHub repo
  directly attest to Notarization's canonical existence.
- [x] Module signatures match the product's documented features
  (dynamic + locked modes, timelock).
- [x] Two independent deployers shipping the same 5-module core —
  consistent with IF's engineering practice of running staging +
  production deployer keys or multi-region ops.
- [x] No other IOTA mainnet deployer ships a `dynamic_notarization`
  module.

Attribution conclusive.

## IOTA Traceability [x] VERIFIED

Deployers:
- `0x46365ba3a2eab8639d41f8ff2be3adf50e384db5c7d81b0d726bfea5674fb3f5` (1 package)
- `0x8009891c7a1f173f03b72a674c9a65016c65250813b00f0b20df8d23f1c8a639` (1 package)
- `0xd604621407ca777658c5834c90c36a432b38f9ace39fe951a87c03f800515bbe` (4 packages)

Project: Traceability (`teamId: 'iota-foundation'`).

### Public attestation

- **Product page:** [iota.org/products/traceability](https://www.iota.org/products/traceability).
- IOTA Foundation publicly positions supply-chain traceability as
  one of their flagship enterprise use cases. The product is
  documented under iota.org solutions for trade, food provenance,
  pharma supply chains, etc.
- Note: the product page doesn't publish specific deployer addresses
  (the same issue as Notarization before the iotaledger GitHub link
  bridged it; no comparable iotaledger repo has surfaced for
  Traceability specifically in my searches).

### On-chain match — 6 packages, all single-module

All 6 packages contain exactly one module: `traceability`. Three
deployers ship the same minimalist contract:

- `0xee5e416d…99163` — from `0x4636…b3f5` (1 package)
- `0x288042cc…41ad0f` — from `0x8009…a639` (1 package)
- `0xa8eef587…de513`, `0xfa481ddb…d5c9`, `0x48703d55…bb4aa`,
  `0x2da124ac…713cf` — from `0xd604…5bbe` (4 packages)

Pattern (multiple deployers, single-module packages, identical
module name) is consistent with a customer-per-package deployment
model: each traceability customer gets their own package instance
from the IOTA Foundation's deployer pool. Analogous to Salus's
per-batch-package pattern but on a smaller scale.

### Registry adequacy

Current rule `{all: ['traceability']}` matches all 6 packages
cleanly. Our scanner aggregates them into one "Traceability" row
keyed by `def.name`, so all 6 packages count toward a single row
rather than fragmenting.

### Triangulation

- [x] IOTA Foundation's product page publicly positions Traceability
  as an IF flagship.
- [x] Module name `traceability` is generic but unique on IOTA
  mainnet (no other deployer ships a module with that name).
- [x] 3 separate deployers ship identical single-module packages —
  consistent with a coordinated deployment campaign by one
  organization, which IF is the only plausible candidate for.
- [x] The traceability use case directly maps to IOTA's publicly
  documented enterprise supply-chain initiatives (TLIP, Salus, etc.).
- ⚠️ No direct iotaledger-repo reference published for Traceability
  specifically (unlike Notarization). Could be because the product
  is deployed per-customer rather than from a single canonical repo.

Attribution [x] conclusive on organizational grounds, with a minor
gap in direct address-to-repo mapping.

### Why 3 deployers?

Possibilities worth noting:

1. **Per-customer key separation** — IF's enterprise customers
   (food, pharma, logistics) each get their own deployer for data
   isolation. Each deployer publishes packages for one customer's
   supply chain.
2. **Staging / production split** — internal test vs. prod keys.
3. **Multi-region ops** — three deployers reflecting different
   deployment pipelines.

All three explanations still attribute to IF as the orchestrator —
no third-party could coordinate this pattern without IF's
involvement.

## IOTA Foundation (TLIP) [x] VERIFIED — organization-level attestation

Deployer: `0xd7e2de659109e51191f733479891c5a2e1e46476ab4bafe1f663755f145d5176`.
Project: TLIP (Trade).

### Public attestation — strong organizational level, no direct address publication

TLIP is the **Trade and Logistics Information Pipeline**, a flagship
IOTA Foundation + TradeMark East Africa (TMEA) collaboration for
digital trade documents (electronic Bills of Lading, Certificates of
Origin, Commercial Invoices). Extensively documented at the product
level:

- **Dedicated product site:** [tlip.io](https://www.tlip.io/)
- **Wiki (technical docs):** [wiki.tlip.io](https://wiki.tlip.io/docs/section-6/overview),
  published from GitHub org `tmea-tlip/wiki.tlip.io`.
- **IOTA Foundation coverage:**
  [blog.iota.org/tlip-website](https://blog.iota.org/tlip-website/),
  and an official showcase PDF hosted by IOTA at
  `files.iota.org/comms/TLIP_IOTA_Showcase_Presentation.pdf`.
- **Partner documentation:** TradeMark Africa's project page at
  [trademarkafrica.com/projects/trade-logistics-information-pipeline-tlip](https://trademarkafrica.com/projects/trade-logistics-information-pipeline-tlip/).
- **Medium posts** at `@tlip.io` describing system architecture.

Gap: **none of these sources publish the specific IOTA mainnet
package address.** TLIP's wiki focuses on architecture (the
Auditable Item Graph, Digital Identity, Document Management) rather
than deployed-contract references — consistent with a
government-facing product where developers interact via TLIP's
REST API at `api.tlip.io`, not directly with the Move package.

### On-chain match

Deployer `0xd7e2…5176` has published exactly **1 package**:

- `0xdeadee97bb146c273e9cc55ec26c1d2936133119acc1b2fc0b542e279007e108`
  — 5 modules: `carrier_registry, ebl, endorsement, interop_control,
  notarization`. This is **textbook TLIP** architecture:
  - `ebl` — electronic Bill of Lading (TLIP's flagship primitive)
  - `carrier_registry` — registry of authorized carriers (TLIP's
    permissioned model)
  - `endorsement` — endorsement chain for transferring title on the
    eBL (core eBL semantics)
  - `interop_control` — interoperability bridge (TLIP explicitly
    targets interop with other trade networks)
  - `notarization` — shares naming with IOTA Foundation's broader
    Notarization primitive

The package address `0xdeadee97…` is also a **vanity prefix** (begins
with `deadee…` — deliberate, not a collision). Flagship IOTA-
Foundation-adjacent products occasionally use vanity prefixes for
deployment visibility; iBTC's lack of one and Virtue/Swirl's random
addresses are the norm. The deliberate prefix is further evidence of
an institutional deployment.

### Triangulation

- [x] IOTA Foundation publicly endorses TLIP as an IOTA product (blog
  post + hosted showcase PDF).
- [x] TLIP has its own domain (tlip.io), wiki (wiki.tlip.io), partner
  documentation (TradeMark Africa), and a Medium publication —
  extensive public footprint.
- [x] The module-name set `{ebl, carrier_registry, endorsement,
  interop_control, notarization}` matches TLIP's documented system
  architecture exactly — eBL + carriers + endorsement chains are
  TLIP's core primitives.
- [x] `ebl` is TLIP-specific terminology — TLIP is the primary
  IOTA-based eBL implementation, and no other IOTA deployer ships
  an `ebl` module.
- [x] Deployer narrow scope: 1 package, 5 modules, no off-topic
  deployments.
- [x] Vanity address prefix `0xdeadee97…` signals institutional
  intent.

Attribution conclusive at the organizational level. The
"unverified-specific-address" gap is TLIP's, not ours — they don't
publicize their Move package address because the product audience
(governments, shipping lines) interacts via API, not directly with
the chain.

### Registry adequacy

Current rule:

```ts
packageAddresses: ['0xdeadee97bb146c273e9cc55ec26c1d2936133119acc1b2fc0b542e279007e108'],
all: ['ebl'],
```

The address match catches the one current package; the `ebl`
module rule would catch any future TLIP upgrade even at a new
address (as long as they keep that module name). No other IOTA
deployer ships `ebl`, so the module rule is safe.

Rule is fine as-is.

### Why TLIP stays a separate team from `iota-foundation`

TLIP has its own brand (tlip.io), own wiki, own GitHub org
(`tmea-tlip`), own Medium publication, and operates as a partnership
with TMEA rather than as a standard IF product line. Keeping it out
of the consolidated `iota-foundation` team preserves that
external-brand distinction.

### Registry naming — promote TLIP to a standalone brand

The current team is named `IOTA Foundation (TLIP)` with id `if-tlip`.
That framing made sense when we were splitting every IF product into
its own `IOTA Foundation (X)` team, but after the team-consolidation
pass (which collapsed the IF-subproduct teams into a single
`iota-foundation` team), TLIP is the sole surviving exception.
Since TLIP has its own brand footprint independent of IF, promote it
to a standalone team entry:

- **Team id:** `if-tlip` → `tlip`
- **Team name:** `IOTA Foundation (TLIP)` → `TLIP`
- **Team description:** surface the TMEA partnership (e.g.
  "Trade and Logistics Information Pipeline — IOTA + TradeMark East
  Africa partnership for digital trade documents").
- **Project name:** `TLIP (Trade)` → `TLIP` (drop the parenthetical
  since no disambiguation is needed once the team stands alone).
- **Project teamId:** update reference from `if-tlip` → `tlip`.
- **File rename:** `teams/trade/if-tlip.ts` → `teams/trade/tlip.ts`
  (optional but consistent with the id rename).

This change does not affect on-chain matching, attribution
correctness, or event counting — it's purely branding cleanup in
line with how we handle other standalone projects (Tradeport, Swirl,
Virtue, Pools Finance, Echo Protocol, Cyberperp).

## IOTA Foundation (Testing) 🟡 CIRCUMSTANTIAL — strong pattern, no direct attestation

Deployers:
- `0xb83948c6db006a2d50669ff9fc80eef8a3a958bd3060050865fe9255fa4e5521` (45 packages)
- `0x278f2a12f9cb6f2c54f6f08bad283c3abc588696fadff6cf9dd88fd20019afeb` (17 packages)
- `0x164625aaa09a1504cd37ba25ab98525cf2e15792f06a12dd378a044a0d719abe` (17 packages)
  — **also TWIN Foundation's deployer** (see 2026-04-18 TWIN entry
  above). 6 of the 17 are TWIN `verifiable_storage` production
  packages, not tests; the other 11 are the `nft` fixtures this
  section describes. Once TWIN lands, `{all: [verifiable_storage]}`
  cleanly routes the 6 to TWIN; the 11 continue to land in
  IF-Testing via NFT-Collections team-deployer routing.

Project: IOTA Foundation (Testing) — reached only via team-deployer
routing out of the NFT Collections bucket (the project def has
`match: {}` and never matches directly).

### On-chain evidence

**79 packages total** across the three deployers, every one with
a single `nft` module — identical single-module structure as Salus's
60 packages. Sampled NFT objects confirm:

- **Tag vocabulary:** `regular_comparison`, `complex_tag`, `test_tag`,
  and (per prior documentation) `gas_station_*`, `transfer_test`,
  `gas_station_basic`, etc. These are test-fixture names, not
  production asset labels.
- **NFT schema:** `{id, immutable_metadata, tag, metadata, issuer,
  issuerIdentity, ownerIdentity, network}` — **the exact same NFT
  schema as Salus**. Both use `issuerIdentity` and `ownerIdentity`
  fields which point to IOTA Identity objects. That's a shared
  template, strongly suggesting an IOTA-Foundation-maintained
  canonical NFT/DWR template that Salus and these test deployers
  both adopt.
- **Issuer self-attestation:** each NFT carries `issuer = <the
  deployer address that minted it>`. Same self-attestation pattern
  Salus uses.

### Public attestation — indirect

No source publicly names these specific deployer addresses as
IF-operated. But several organization-level signals:

- IOTA Foundation publicly runs a **Gas Station** product
  (introduced at
  [blog.iota.org/iota-gas-station-alpha](https://blog.iota.org/iota-gas-station-alpha/)) —
  a mainnet transaction-fee-sponsorship service. Internal test
  campaigns validating gas-station flows would naturally mint
  test NFTs with sponsorship-flow-shaped transactions, matching the
  on-chain tag vocabulary we observe.
- The NFT schema (with `issuerIdentity`/`ownerIdentity` IOTA Identity
  integration) is architecturally only useful to entities already
  using IOTA Identity — which is an IOTA Foundation-developed
  product.
- 79 packages is institutional-scale volume; individual developers
  don't mint that many mainnet test packages.

### Plausibility assessment

A non-IF party would need to: (a) mint 79 packages on mainnet,
(b) use tag names like `gas_station_basic` / `transfer_test` /
`regular_comparison` that mirror IF-internal testing vocabulary,
(c) operate from 3 independent-but-related addresses, (d) adopt the
same NFT schema that IF's Salus partnership uses. That combination
is implausible but not impossible — a malicious party could
construct a plausible-looking set of fake "IF test" deployers.

### Triangulation

- [x] Pattern match: 79 packages, single `nft` module, tag names
  matching IF-internal testing vocabulary.
- [x] Schema match: NFT structure identical to Salus (IF-hosted
  template).
- [x] `issuerIdentity` / `ownerIdentity` fields indicate IOTA Identity
  integration — IF's own product stack.
- [x] IOTA Foundation publicly runs a Gas Station service consistent
  with these test patterns.
- ⚠️ No public document explicitly names these deployer addresses as
  IF-operated.
- ⚠️ No audit or code commit references these addresses.

### Why the attribution matters less here than elsewhere

Even if these 3 deployer addresses were NOT IF-operated, the
practical consequences are mild:

1. The display label "IOTA Foundation (Testing)" would be wrong for
   some rows; those rows would more accurately be "NFT Collections
   (deployer-<hash>)". Mild UX issue, not a data-integrity issue.
2. The `if-testing` team's deployer list is only referenced by this
   one project, so no downstream attribution depends on it.
3. The NFT Collections bucket's team-deployer routing would still
   fire for any single-project team; if we're wrong about IF Testing,
   the routing target was just mislabeled.

### Upgrade paths

- **Ideal:** IOTA Foundation publishes a gas-station retrospective
  naming the test-deployer addresses. Unlikely to happen since it's
  internal infrastructure.
- **Plausible:** Find a commit in IF's gas-station GitHub repo
  (`iotaledger/*`) that references one of the 3 addresses in a test
  config or integration test. Worth a grep pass across IF's public
  repos.
- **Downgrade option:** If evidence stays weak, consider demoting
  this project's visibility (e.g. hide it from the main landing
  page, keep it accessible only via the teams endpoint) so we're
  not surfacing uncertain attribution prominently.

### Registry adequacy note

The `if-testing` team is intentionally kept separate from the
consolidated `iota-foundation` team (would break the NFT
Collections → IF-Testing deployer routing if merged). This
design decision is documented in the Virtue/CyberPerp/team-consolidation
sections earlier in this handoff.

**No registry changes needed** for this verification. The
attribution is at the "reasonable working hypothesis" level, clearly
flagged as such, and if a better source appears later the upgrade
is just a docstring update.

## OID Identity [x] VERIFIED as ObjectID (initial investigation below, resolution further down)

**Status updated 2026-04-17 (second pass).** Applied the same
object-probe technique that cracked TokenLabs and izipublish.
Sampling `oid_identity::ControllerCap` objects revealed each has a
`linked_domain` field identifying the tenant organization. The
dominant domains resolve to **[ObjectID](https://objectid.io/)** —
"Trust Redefined" — a blockchain-based product-authenticity
platform with an [IOTA Foundation showcase](https://www.iota.org/learn/showcases/objectID)
and a patent filed with the European Patent Office for decentralized
product-ID on IOTA. Full resolution writeup at the bottom of this
section.

(Original investigation:)

Deployers:
- `0x59dadd46e10bc3d890a0d20aa3fd1a460110eab5d368922ac1db02883434cc43` (11 packages)
- `0xbca71c7ae4b8f78e8ac038c4c8aca89d74432a6def0d6395cc5b5c898c66b596` (1 package)

Project: OID Identity.

### On-chain evidence — broader than our match rule captures

Scan reveals a comprehensive system, not just a single identity
contract:

**Deployer #1 (11 packages):**
- 3 upgrade versions of the core: modules `{oid_credit, oid_identity,
  oid_object}` — note: **`oid_object` is a third core module our
  current match rule misses**.
- 2 `oid_config` packages (1 module each).
- 3 `oid_document` packages (1 module each — document-handling.)
- 1 `allowlist_rule` package (Move Kiosk transfer policy — allowlist
  authorization).
- 1 `utils` package.
- 1 `OIDGs1IHub` package — **GS1 Integration Hub**. Module name
  parses as "OID GS1 I[ntegration] Hub".

**Deployer #2 (1 package):**
- 1 `{oid_credit, oid_identity, oid_object}` package — same core
  signature as deployer #1.

Total: 12 packages. Two deployers with shared core module
signatures → same team operating both.

### The GS1 signal — likely a supply-chain identity system

The `OIDGs1IHub` module name strongly suggests **GS1** integration:

- **GS1** is the global standards body behind barcodes, GTINs, GLNs,
  SSCCs, EPC (Electronic Product Code), and the GS1 Digital Link
  standard.
- IOTA has documented partnership/compatibility with GS1 standards
  ([iota.org/learn/focus-areas](https://www.iota.org/learn/focus-areas)
  mentions supply chain + identity integration with GS1).
- IOTA's Track & Trace Ledger APIs historically supported GS1
  EPCIS Business Events and Digital Link Identifiers.
- In this context, "OID" almost certainly stands for **Object
  IDentifier** (GS1-style), not a self-chosen brand abbreviation.

So the project's substance is: a GS1-compatible supply-chain
Object-ID system on IOTA, with identity + credit + document
features. Target audience: enterprises using GS1 standards who want
on-chain provenance/trust anchoring.

### Public attestation — missing

Direct searches don't surface a named "OID" project on IOTA. No
audit, no dedicated domain, no blog post. The team may be:

- An early-stage or private supply-chain builder.
- Part of IOTA's Business Innovation Program (BIP) or similar
  ecosystem fund — those participants sometimes deploy to mainnet
  before public launch.
- A pilot program with a specific enterprise customer (bonds/trade
  finance, consumer goods, pharma) whose identity is confidential.

Attribution stays at the "on-chain pattern + GS1 context" level —
stronger than pure guesswork, short of verified.

### Triangulation

- [x] Both deployers ship a coherent product family with shared core
  module signatures.
- [x] Module naming (`oid_credit`, `oid_identity`, `oid_object`,
  `oid_config`, `oid_document`, `OIDGs1IHub`) is internally consistent
  with a single-team supply-chain identity system.
- [x] GS1 integration module strongly suggests the OID prefix means
  Object IDentifier, not a coincidental name.
- [x] No other deployer on IOTA mainnet ships any `oid_*` module or
  the `OIDGs1IHub` module.
- ⚠️ No public project brand identified.
- ⚠️ No audit or dedicated docs.
- ⚠️ No direct IF/ecosystem blog mention of this specific team.

### Registry adequacy — undercount

Current rule `{all: ['oid_credit', 'oid_identity']}` matches 4 of
12 packages. The other 8 (config, document, allowlist, utils, GS1
hub) are not attributed to OID Identity.

Options to fix:

1. **Add `oid_object`** to the match: `{all: ['oid_credit',
   'oid_identity', 'oid_object']}`. Catches the same 4 packages (no
   improvement; the 4 already contain all three) — but makes the
   rule tighter if other teams ever ship `oid_credit` alone.
2. **Add sub-product defs** for the document / config / GS1 hub
   packages:
   - "OID Documents" → `{exact: ['oid_document']}` (but risky —
     single-module generic-sounding name; could false-match).
   - "OID GS1 Hub" → `{exact: ['OIDGs1IHub']}` — safe (unique name).
3. **Switch to deployer-address match** (requires scanner change,
   same as Tradeport/LayerZero undercount). Matches all packages
   from the 2 OID deployers regardless of module signature. Cleanest
   solution if we had it.
4. **Or accept the undercount** — low priority since OID's
   public profile is also low.

### Upgrade paths for attribution

- **Search IOTA's Business Innovation Program participants** —
  [iota.org/build/business-innovation-program](https://www.iota.org/build/business-innovation-program)
  lists BIP recipients. A GS1-compatible supply-chain OID builder
  likely fits this pool.
- **Ask in IOTA Discord** about the `OIDGs1IHub` package — someone
  internal to IF will know who this is.
- **Grep for `OIDGs1IHub`** across IOTA-related GitHub orgs and
  Medium — the term is unique enough that any public mention will
  directly identify the team.

### Team name consideration

If we confirm this is a GS1-focused Object-ID system, the team name
in the registry could be more accurate:
- Current: `name: 'OID Identity'` (implies a generic identity
  protocol).
- Better: `name: 'OID Supply-Chain Identity (GS1)'` or similar —
  surfaces the actual use case.

Deferred until we can attribute the team concretely.

## OID Identity → ObjectID [x] VERIFIED (resolution of the above)

Actual team: **[ObjectID](https://objectid.io/)** — "Trust
Redefined", a blockchain-based product-authenticity and digital-twin
platform built on IOTA. Offers tamper-proof digital identities for
physical products using IOTA Identity DIDs + Move smart contracts.
Patent filed with the European Patent Office for their decentralized
product-ID system.

### Attribution resolution

Applied the same probe technique that cracked TokenLabs and
izipublish: enumerate every struct type the module declares, query
for live objects of that type, and inspect their fields for identity
markers.

For OID, the decisive struct was `oid_identity::ControllerCap`,
each instance of which carries a `linked_domain` field naming the
tenant organization. Sampling ControllerCaps across all 4 core
packages revealed:

| Tenant domain                | ControllerCaps | Role                                                          |
|------------------------------|----------------|---------------------------------------------------------------|
| `https://nxc.technology/`    | 9              | Power user (multiple IDs, multi-package usage)                |
| `https://lizardmed.it/`      | 2              | **Lizard Medical Italy — ObjectID's featured launch partner** |
| `https://fomofox.info/`      | 1              | Tenant                                                        |
| `https://royalprotocol.org/` | 1              | Tenant                                                        |
| `https://www.opentia.com/`   | 1              | Tenant                                                        |
| `https://icoy.it/`           | 1              | Tenant                                                        |

The domain `lizardmed.it` is the smoking gun — news coverage
explicitly names Lizard Medical Italy as ObjectID's first onchain-
verified product launch partner:

> "ObjectID shared the linked dApp page that displays details for
> a specific ObjectID, a unique cryptographic hash, produced by
> Lizard Medical Italy. ObjectID announced the launch of its
> decentralized application (dApp), tracking its first physical
> product on the IOTA network."
> — Bitget News, "IOTA Advances Real-World Adoption as ObjectID
> Launches Onchain-Verified Product"

### What ObjectID actually is

Per [objectid.io](https://objectid.io/) and the [IOTA showcase](https://www.iota.org/learn/showcases/objectID):

- **Product category:** "Digital twins for authentic and transparent
  products" — an anti-counterfeiting and supply-chain provenance
  platform.
- **Architecture:**
  - Users scan a QR code on a physical product to open the dApp.
  - The dApp verifies the creator's W3C-standard DID, which is
    tied to the issuer's domain (via the ControllerCap's
    `linked_domain` field we see on-chain).
  - Product events (creation, maintenance, certification,
    ownership transfer) are recorded as `OIDEvent` objects on
    IOTA using verifiable credentials + Move contracts.
  - Framework is **multi-tenant** — each customer organization
    gets its own ControllerCap(s) linked to their verified domain.
- **Patent:** ObjectID filed with the European Patent Office for
  their decentralized product-ID system on IOTA mainnet.
- **IOTA Foundation endorsement:** official Technology Showcase
  page at `iota.org/learn/showcases/objectID`, blog coverage at
  Bitget, cryptonews.net, bitcoinethereumnews.com, crypto-news-flash.
- **Also covered:** "Can IOTA and ObjectID Eliminate the $450B
  Counterfeiting Problem?" — positioning as anti-counterfeiting
  infrastructure.

**Why "OID" was our registry name:** OID = **Object ID**. Not
Original Issue Discount, not a generic identity protocol — it's
literally short for ObjectID. The module prefixes (`oid_credit`,
`oid_identity`, `oid_object`, `oid_document`) all follow the pattern
`<product>_<primitive>`. The `OIDGs1IHub` module is the GS1
integration hub (GS1 = global supply-chain barcode/EPC standards),
which is ObjectID's interop bridge with existing supply-chain
identifiers.

### On-chain product breakdown (full inventory)

From the original probe:

- **Core identity** (`{oid_credit, oid_identity, oid_object}` × 4
  versions across 2 deployers) — product DIDs, object registry,
  credit/reputation.
- **Documents** (`oid_document` × 3 versions) — document workflows
  with creator/editor/approver/publisher roles and approval flags.
- **Config** (`oid_config` × 2 versions) — framework-wide settings,
  registered official packages, JSON config.
- **Transfer policy** (`allowlist_rule`) — Move Kiosk allowlist
  rule for transfer-restricted assets.
- **Utility** (`utils`) — shared helpers.
- **GS1 Integration Hub** (`OIDGs1IHub`) — GS1 registry for
  supply-chain identifier lookup (`by_gs1`, `by_alt`, `by_id`
  indexes).

Module introspection of the `oid_object` module confirms the core
struct set:

```
module oid_object:
  structs: OIDCounter, OIDEvent, OIDMessage, OIDObject
```

`OIDObject` has fields `{object_type, object_did, creator_did,
owner_did, agent_did, creation_date, description}` — a DID-based
physical-object identity.

`OIDEvent` has `{event_type, timestamp, creator_did,
immutable_metadata, mutable_metadata}` — lifecycle events per
object (creation, certification, maintenance, transfer).

The `OIDDocument` fields (`creator_did`, `editors_dids`,
`approvers_dids`, `publisher_did`, `owner_did`, `approval_flags`)
implement a signed-document workflow for e.g. product
certifications.

### Triangulation

- [x] Framework's public-facing name and patent match what we see
  on-chain (ObjectID / OID / "object identity").
- [x] ControllerCap `linked_domain` fields reveal multi-tenant
  customer organizations; **lizardmed.it** matches press coverage
  as ObjectID's featured launch partner.
- [x] IOTA Foundation Technology Showcase page endorses ObjectID as
  an IOTA ecosystem partner.
- [x] Architecture (QR-code → DID-verification → on-chain event
  anchoring) matches on-chain evidence (DIDs, OIDEvent timestamps,
  domain-linked caps).
- [x] Multi-tenant pattern (one framework, many customer domains)
  is visible in both the marketing material and the on-chain
  ControllerCap distribution.

Attribution conclusive.

### The tenants (bonus attribution data)

The on-chain `linked_domain` list is a directory of ObjectID's
early customers, useful for future project attribution:

- **Lizard Medical Italy** (lizardmed.it) — medical-product
  provenance; ObjectID's first onchain-verified product launch.
- **NXC Technology** (nxc.technology) — largest tenant by cap
  count; likely a dev/integrator or active pilot customer.
- **FomoFox** (fomofox.info)
- **Royal Protocol** (royalprotocol.org)
- **Opentia** (opentia.com)
- **Icoy** (icoy.it)

These tenants are **not separate registry teams** — they're
customers of ObjectID using the same framework, each anchored to
their own domain for DID chain-of-trust.

### Registry undercount — our rule catches 4 of 12 packages

Current rule `{all: ['oid_credit', 'oid_identity']}` matches 4 of
12 ObjectID packages (the 4 core-identity versions). The other 8
(documents, config, allowlist, utils, GS1 hub) are not attributed
to ObjectID today.

### Registry corrections needed

1. **Rename team `oid` → `objectid`.**
   - `id: 'objectid'`
   - `name: 'ObjectID'`
   - `urls:`
     - `{label: 'Website', href: 'https://objectid.io'}`
     - `{label: 'IOTA Showcase', href: 'https://www.iota.org/learn/showcases/objectID'}`
   - `description:` "Blockchain-based product-authenticity platform
     on IOTA Rebased. Assigns tamper-proof digital twins to physical
     products using IOTA Identity DIDs + Move smart contracts. QR-
     scan → DID-verify → on-chain event anchoring. Multi-tenant
     framework; GS1-integration-capable. Patent filed with the
     European Patent Office. Launch partner: Lizard Medical Italy."
   - File rename: `teams/identity/oid.ts` →
     `teams/identity/objectid.ts`.

2. **Rename project `OID Identity` → `ObjectID`.**
   - `teamId: 'objectid'`
   - `category`: `Identity` → `RWA / Product Authenticity`
   - Expand match rule (current catches 4/12 packages; others
     are uncaptured). Options:
     - **Umbrella with deployer-match** — simplest, catches all 12
       ObjectID packages at both deployers.
     - **Sub-products** — split into `ObjectID Identity`
       (core), `ObjectID Documents`, `ObjectID GS1 Hub`, etc.

3. **Update status from 🟡 to [x].**

### Methodological note

The **ControllerCap `linked_domain` probe** is a reusable attribution
channel for multi-tenant DID-based products. If a Move module
exposes a capability object containing a domain field, each capability
instance is effectively a signed tenant registration. For
ObjectID that translated directly to a tenant directory.

This is the same class of signal as:
- `IotaFlipHouse` (struct name embeds brand → IOTA Flip)
- `iota_liquidlink_profile` (module name embeds brand → LiquidLink)
- `station_nottingham` / `station_mount_austin` (modules embed
  real-world locations → Bolt.Earth)
- `tln_token` (module name embeds token → TokenLabs)
- `cars.izipublish.com` (content JSON embeds domain → izipublish)

Pattern: **the contract's own fields/module-names/content contain
the brand or tenant.** Once we learn to look for them,
previously-opaque registry entries resolve immediately.

## Bolt Protocol → Bolt.Earth [x] VERIFIED — registry name is wrong

Deployer: `0x1d4ec616351c6be450771d2b291c41579177218da6c5735f2c80af8661f36da3`.
Project: Bolt Protocol (registry), actually **Bolt.Earth RealFi**.

**Our registry calls this "Bolt Protocol", but the real team is
Bolt.Earth — India's largest EV charging network, now tokenizing
real-world charging stations on IOTA Rebased as part of their RealFi
product.** Easy to confuse because there are *three unrelated*
"Bolt Protocol" projects on other chains (Chainbound's Ethereum
preconfirmation protocol at `docs.boltprotocol.xyz`, a Stacks/Bitcoin
project, and Bolt Payments). Ours is none of those.

### Public attestation — gold-standard via real-world-location module names

- **Bolt.Earth** ([bolt.earth](https://bolt.earth/)) — India's
  largest EV charging network, founded 2017, Bengaluru, 100,000+
  chargers across 1,800+ cities.
- **Partnership announcement:** IOTA + Bolt.Earth launched RealFi
  on IOTA's mainnet, tokenizing physical EV charging stations as
  on-chain shares with NFT-represented ownership and
  smart-contract-automated yield distribution. Press coverage at
  [cryptonews.net](https://cryptonews.net/news/altcoins/31874237/),
  [mexc.co/news/501685](https://www.mexc.co/news/501685).
- **Technical stack confirmation:** cryptonews.net explicitly states
  "Each of these stations has been registered and tokenized on-chain
  during the testing phase using the $IOTA Rebased Move VM."
- **Specific pilot locations named in press:** Mount Austin in
  Johor Bahru, Malaysia; Nottingham in the United Kingdom
  (Bolt.Earth's "first European pilot site").

### On-chain match — real-world location names in module identifiers

Deployer `0x1d4e…6da3` has published **1 package** with **11 modules**:

```
0x7110f3de3ddd9621d27def0543c5bce0b16140322fce9e34fcd63170a64d56b9

modules (11):
  bolt
  proxy
  registry
  shares
  station
  station_ecomajestic
  station_majestic_labs
  station_mount_austin   ← Mount Austin, Johor Bahru, Malaysia
  station_nottingham     ← Nottingham, United Kingdom
  tokenized_asset
  unlock
```

**The decisive signal:** module names `station_mount_austin` and
`station_nottingham` are exactly the two pilot locations cryptonews
names for Bolt.Earth's RealFi testnet-to-mainnet rollout. A
coincidence on this specificity is not plausible. `station_ecomajestic`
and `station_majestic_labs` are likely additional Bolt.Earth pilot
operators/properties (searches surface EcoMajestic as a Malaysian
township / residential brand — consistent with a second Malaysian
charging location).

Supporting modules match the described product surface exactly:
- `tokenized_asset` — NFTs representing charger ownership
- `shares` — on-chain shares in charging infrastructure
- `unlock` — yield-distribution mechanics
- `registry` + `station` — the station registry abstraction
- `bolt` — the top-level module carrying Bolt.Earth's brand
- `proxy` — likely the upgrade-proxy pattern

### Triangulation

- [x] Bolt.Earth publicly announced IOTA RealFi partnership with
  testnet-to-mainnet rollout.
- [x] Press coverage names specific pilot locations (Mount Austin,
  Nottingham) — on-chain modules are literally named after those
  locations.
- [x] Press coverage explicitly states the deployment uses IOTA
  Rebased Move VM.
- [x] Module signatures (`shares`, `tokenized_asset`, `unlock`) match
  the described RealFi architecture (tokenized real-world EV charger
  ownership + yield distribution).
- [x] Only one deployer on IOTA mainnet ships this specific package
  signature.

Attribution conclusive. This is arguably the strongest attribution
in the whole handoff — when on-chain module names literally include
real-world city names that match press coverage, there is no
plausible alternative team.

### Registry adequacy

Current rule `{all: ['bolt', 'station']}` matches 1/1 package. No
undercount.

### Registry corrections needed — rename the team

1. **Rename team `bolt-protocol` → `bolt-earth`.**
   - `id: 'bolt-earth'` (was `bolt-protocol`)
   - `name: 'Bolt.Earth'` (was `Bolt Protocol`)
   - `description`: e.g. "India's largest EV charging network —
     tokenizing real-world EV charging stations on IOTA Rebased via
     RealFi, with on-chain shares, NFT ownership, and
     smart-contract-driven yield distribution."
   - `urls: [{label: 'Website', href: 'https://bolt.earth'}]`
2. **Rename project `Bolt Protocol` → `Bolt.Earth RealFi`.**
   - `name: 'Bolt.Earth RealFi'` (was `Bolt Protocol`)
   - `teamId: 'bolt-earth'` (was `bolt-protocol`)
   - `category: 'DePIN / RWA'` (was `Protocol`) — the product
     tokenizes real-world infrastructure, so RWA/DePIN is more
     accurate than `Protocol`.
   - Consider adding a `sources` / `attribution` entry pointing to
     the bolt.earth site and the IOTA partnership press coverage.
3. **File rename** `teams/misc/bolt-protocol.ts` →
   `teams/misc/bolt-earth.ts` (optional but consistent with the
   id rename; also consider moving it out of `misc/` since DePIN is
   a distinct category — but that's a directory-organization
   question, not attribution).

This correction turns one of the vaguest entries in the registry
into one of the strongest. The current `Bolt Protocol` label is
actively misleading because of the three unrelated projects with
similar names.

## Easy Publish [x] VERIFIED as izipublish (initial investigation below, resolution further down)

**Status updated 2026-04-17 (second pass).** Sampling live objects
from the easy_publish packages revealed published DataItem content
containing the domain `cars.izipublish.com`. That resolves the
attribution: this framework is the on-chain backend for **izipublish**,
an IOTA Data Publishing dApp at [izipublish.com](https://izipublish.com).
Full resolution writeup at the bottom of this section.

(Original investigation:)

Deployer: `0x0dce85b04ae7d67de5c6785f329aac1c429cd9321724d64ba5961d347575db97`.
Project: Easy Publish.

### Key finding — this is a data-publishing framework, not a CLI helper

Our current registry description calls it a "Simplified Move package
publishing tool for IOTA Rebased. Lowers the barrier for developers
to deploy smart contracts by abstracting the publish transaction
flow." **That's wrong.** Module introspection reveals 19 functions
and 20 structs that form an on-chain **data-publication /
content-management framework**, not a CLI helper:

**Structs:**
- `Container`, `ContainerAudit`, `ContainerChain`, `ContainerChildLink`
  — hierarchical data containers with audit trails and parent-child
  relationships.
- `ContainerPermission`, `Creator` — multi-owner access control.
- `DataItem`, `DataItemChain`, `DataItemPublishedEvent` — versioned
  data items with publication events.
- `ChainInit`, `ContainerEventConfig`, `ContainerPermissionEvent`,
  `ContainerUpdatedEvent`, `ContainerLinkUpdatedEvent`,
  `DataItemPublishedEvent`, `CreatorEvent` — comprehensive event
  emission for audit.

**Functions (selected):**
- `create_container`, `attach_container_child`, `update_container`,
  `update_container_child_link` — container CRUD.
- `publish_data_item`, `publish_data_item_verification` — data
  publication + verification flows.
- `create_data_type`, `update_data_type` — schema management.
- `add_owner`, `remove_owner`, `assert_owner` — multi-owner
  permissions, with `update_container_owners_active_count` / v2 for
  tracking active-owner counts.

**So what is it, really?**
- An on-chain document / content management system, OR
- A data-provenance framework with hierarchical containers, OR
- A middleware layer that other apps use to anchor structured
  records on IOTA.

The name "Easy Publish" refers to **easily publishing data**, not
easily publishing Move packages. The module is mid-sized and
mature — 5 upgrade versions across time, consistent single-module
signature.

### On-chain evidence

5 package upgrade versions at one deployer, all containing exactly
one module named `easy_publish`:

- `0x7c268fae…947324`
- `0x75eacced…044786`
- `0xb0927f14…7dc67`
- `0x5915e379…35835`
- `0x413ae997…7f1f14` (sampled for internals above)

No other deployer on IOTA mainnet ships an `easy_publish` module.

### Public attestation — none found

Web searches for `"Easy Publish" IOTA` and `"easy_publish" Move`
surface only generic IOTA package-publishing CLI docs. No dedicated
project site, no audit, no Medium post, no blog announcement, no
GitHub repo publicly mentions `easy_publish` as a product.

Possible explanations:
- **Infrastructure layer.** A mid-maturity CMS/data-anchoring
  framework used by other apps (maybe TLIP, Salus, or a private
  customer) without direct consumer branding.
- **Early-stage product.** Under development, not yet publicly
  marketed.
- **IOTA Foundation internal.** An IF-maintained publishing
  framework used internally; the deployer being separate from the
  consolidated `iota-foundation` team would be explained by a
  distinct dev team or deployment pipeline.
- **Enterprise pilot.** Deployed for a specific customer who hasn't
  publicized their partnership.

### Triangulation

- [x] 5 upgrade versions indicate active development and real use
  (not a one-off experiment).
- [x] Module internals reveal a substantive, well-designed
  content-management architecture with events, permissions, and
  versioning.
- [x] Single deployer, narrow scope.
- ⚠️ No public attestation.
- ⚠️ Team identity unknown.

Attribution stays 🟠 UNVERIFIED. We know **what** the contract does
(content-management / data-publication framework), but not **who**
runs it.

### Registry corrections needed (from initial investigation — superseded below)

1. **Update the project description** — current text claims this is
   a package-publishing helper, which is factually wrong. Replace
   with something like:
   > "On-chain data-publication and content-management framework.
   > Provides hierarchical containers, versioned data items,
   > multi-owner permissions, and an event-audit trail for
   > structured-data publication on IOTA Rebased. Team identity
   > unverified."
2. **Update category** from `Tooling` to e.g. `Data / CMS` or
   `Infrastructure` to reflect what it actually does.
3. **Attribution upgrade paths:**
   - Try asking in the IOTA developer Discord about `easy_publish`.
   - Check IOTA Business Innovation Program participants for a
     CMS/data-management pilot.
   - Grep IOTA-adjacent GitHub orgs for `easy_publish.move` (the
     unauthenticated GitHub code-search API doesn't work here, but
     an authenticated search would).
4. **Downstream apps.** If any other on-chain project imports or
   references this `easy_publish` package (via Move.toml), the
   relationship would be a strong hint. Worth a static-analysis
   pass across other deployed packages' dependency graphs if we
   ever want to chase this.

## Easy Publish → izipublish [x] VERIFIED (resolution of the above)

Actual team: **izipublish** — an "IOTA Data Publishing dApp" at
[izipublish.com](https://izipublish.com), with a live demo at
[cars.izipublish.com](https://cars.izipublish.com) for automotive
maintenance-record publishing.

### Attribution resolution

Applied the same object-probe technique that cracked TokenLabs.
Re-queried for live objects of every struct type declared by the
`easy_publish` module (Container, DataItem, ContainerChain,
DataItemChain, ChainInit, Creator, etc.) across all 5 upgrade
versions of the package. Found live usage on the middle version
`0xb0927f14…`:

- 3 `Container` objects (one named "Genesis Container 1")
- 3 `DataItem` objects
- Plus `ChainInit`, `ContainerChain`, `DataItemChain` registry objects

Inspected the DataItem fields. The `content` field of two DataItems
contains JSON structured data with a **`targets` list specifying a
domain to publish to**:

```
name: Year 2025 Maintenance
content: {"easy_publish":{"publish":{"targets":[{"domain":"cars.izipublish.com","base_url":"https://cars.izipublish.com","enabled":true}]}, "cars":{"maintenance":...}}}
description: First year maintenance.
creator.creator_addr: 0x7c33d09b7b6ddbfed32bd945caae96719ae07f68863d8614c4d96d6d320af429

name: Maintenance april 2026
content: {"easy_publish":{"publish":{"targets":[{"domain":"cars.izipublish.com",...}]},"cars":{"maintenance":...}}
creator.creator_addr: 0x7c33d09b7b6ddbfed32bd945caae96719ae07f68863d8614c4d96d6d320af429
```

The domain `cars.izipublish.com` resolves to a live IOTA Data
Publishing dApp. The parent site `izipublish.com` has a page title
"IOTA Data Publishing dApp | On-Chain Data & Verification" —
confirming the product.

### Product architecture — now properly understood

**izipublish** is a framework + dApp pair:

- **Move framework (`easy_publish` module):** ships the on-chain
  primitives for hierarchical data containers, versioned data
  items, multi-owner permissions, and event-audit trails.
- **Web dApp (`izipublish.com`):** reads the on-chain data and
  renders it to external consumers via domain-targeted publishing.
  Each DataItem specifies which target domain(s) should be
  authorized to render it.
- **Use case demonstrated (`cars.izipublish.com`):** car maintenance
  records. Each maintenance event is a DataItem (`Year 2025
  Maintenance`, `Maintenance april 2026`), anchored on-chain with a
  DataType schema, published to the cars-subdomain for consumer
  access.

The Move package name `easy_publish` was literal branding: "easily
publish structured data on-chain" — the product's entire value
proposition.

### Addresses involved

- **Deployer (Move packages):** `0x0dce85b04ae7d67de5c6785f329aac1c429cd9321724d64ba5961d347575db97`.
  Shipped the 5 upgrade versions of the framework.
- **Publisher / container creator:** `0x7c33d09b7b6ddbfed32bd945caae96719ae07f68863d8614c4d96d6d320af429`.
  Calls the public framework functions to create Containers and
  publish DataItems (the "Genesis Container 1" and maintenance
  records we see on-chain).

Both addresses serve izipublish — the deployer runs the framework,
the publisher creates content. Typical separation of concerns.

### Triangulation

- [x] DataItem content literally names `cars.izipublish.com` as a
  publishing target.
- [x] `izipublish.com` publicly runs an "IOTA Data Publishing dApp"
  (site title confirms).
- [x] The `cars.izipublish.com` subdomain matches the demo use case
  visible on-chain (car maintenance records).
- [x] Module framework design matches the product's purpose (on-chain
  content management with publish-to-external-domain flow).
- [x] Only one deployer on IOTA mainnet ships an `easy_publish`
  module.

Attribution conclusive.

### Caveats on usage / maturity

Despite 5 upgrade versions of the framework on mainnet, actual
usage is modest: only 3 Containers and 3 DataItems live at the
middle package version (`0xb0927f14…`) — suggesting this is a
small-scale demo or early-stage pilot rather than high-volume
production. Events are off (event_config all false on the Genesis
Container), and permissions are restrictive (only owner can
update/publish). The framework is capable of much more but hasn't
scaled up yet.

Worth noting: most usage clusters on one specific upgrade version;
the latest version (`0x413ae997…`) shows no live objects in our
probe, and the earliest version (`0x7c268fae…`) has only Chain/
Registry objects with no Containers. The team may be in the process
of migrating between versions, or the middle version was the
production deploy while others are staging.

### Registry corrections needed

1. **Rename team `easy-publish` → `izipublish`.**
   - `id: 'izipublish'`
   - `name: 'izipublish'`
   - `urls:`
     - `{label: 'Website', href: 'https://izipublish.com'}`
     - `{label: 'Cars demo', href: 'https://cars.izipublish.com'}`
   - `description:` "On-chain data-publishing dApp on IOTA Rebased.
     Provides hierarchical Containers, versioned DataItems,
     multi-owner permissions, and a publish-to-external-domain flow.
     Live demo at cars.izipublish.com for automotive maintenance
     records. Current deployment is small-scale (3 containers, 3
     DataItems), likely pilot stage."
   - `deployers:` **add the publisher address** `0x7c33d09b…0af429`
     alongside the deployer `0x0dce85b04a…`.
   - File rename: `teams/misc/easy-publish.ts` →
     `teams/misc/izipublish.ts` (optional).

2. **Rename project `Easy Publish` → `izipublish`**.
   - `teamId: 'izipublish'`
   - `description`: rewrite from "Simplified Move package publishing
     tool" to reflect the actual product (on-chain data-publishing
     framework serving izipublish.com).
   - `category`: from `Tooling` → `Data / Publishing` or
     `Infrastructure / CMS`.

3. **Update status in the verification table** from 🟠 to [x].

## Points System → LiquidLink [x] VERIFIED — registry name is wrong

Deployer: `0xd6a54ff7f851b58c19729c11d210d46fd46d702b9d9caff78747de1914c934ee`.
Project: Points System (registry), actually **LiquidLink**.

**Our registry calls this "Points System" — a generic descriptor
from before we knew the team. The real project is LiquidLink, a
modular on-chain incentive infrastructure running on both IOTA and
Sui mainnet.** The Points System module signature is their original
loyalty-engine package; subsequent deploys evolved into a full
social-profile + engagement platform.

### Public attestation — gold-standard

- **Official site:** [liquidlink.io](https://www.liquidlink.io/) —
  "Modular On-Chain Incentive Infrastructure."
- **IOTA-specific app:** [iota.liquidlink.io](https://iota.liquidlink.io/)
- **Snap (wallet?):** [snap.liquidlink.io](https://snap.liquidlink.io/)
- **X/Twitter:** [@Liquidlink_io](https://x.com/Liquidlink_io)
- **Product description** (from press coverage):
  LiquidLink's point system is live on IOTA and Sui mainnet with
  integrations to Bucket Protocol + Strater (both Sui projects),
  on-chain profiles, referral system, and a points-system SDK.
  Profile data stored on Walrus. Developing social features.

### On-chain match — product evolution visible

Deployer `0xd6a5…34ee` has published **11 packages** grouped into
four distinct module signatures, visible as an evolution of the
product:

1. **Original Points System core** — `{constant, event, point,
   profile}` exact set:
   - 4 upgrade versions: `0x12fc1744…`, `0x249dd22d…`, `0xcc62dc17…`,
     `0x2ecd5a5d…`
   - Matches our current `Points System` rule.

2. **Refactored core** — `{core, events}`:
   - 2 versions: `0x4d628110…`, `0x4d0f8380…`
   - Likely a simpler v2 of the points engine. **Currently
     unattributed.**

3. **Utility packages** — `{utils}` alone:
   - 2 versions: `0x6d0efef8…`, `0xf9fa275e…`
   - Shared utilities. **Currently unattributed.**

4. **LiquidLink profile + social layer** — the product's evolution
   into social features:
   - `{iota_liquidlink_profile}` alone (1 package — profile NFT
     deployment).
   - `{iota_liquidlink_profile, like}` (2 versions — profile with
     social like/engagement functionality added).

Module introspection of the latest LiquidLink-branded package
(`0xc2d7763307…`) shows exactly what you'd expect from a social
profile product:

```
module iota_liquidlink_profile (5 fn, 5 structs):
  structs: AdminCap, EditCap, IOTA_LIQUIDLINK_PROFILE, ProfileNFT, ProfileRegistry
  functions: get_profile_id, init, mint_to_user, update_image, update_texts

module like (3 fn, 2 structs):
  structs: LikeEvent, LikeTracker
  functions: get_like_count, give_like, migrate
```

Profile NFTs with image/text metadata, a registry, and a like
tracker — a mini social network on-chain.

### Triangulation

- [x] LiquidLink publicly runs on IOTA mainnet, documented on their
  own site + press coverage.
- [x] Module name `iota_liquidlink_profile` literally embeds the
  brand name — irrefutable.
- [x] Product-evolution pattern (simple points system → social
  profile + like engagement) matches LiquidLink's published roadmap
  (launched with points; developing social features on top).
- [x] Multi-chain deployment (IOTA + Sui) matches LiquidLink's
  documented architecture.
- [x] Only one deployer on IOTA mainnet ships the
  `iota_liquidlink_profile` module.

Attribution conclusive.

### Registry undercount — significant

Our current rule `{exact: ['constant', 'event', 'point', 'profile']}`
matches 4 of 11 LiquidLink packages. The remaining 7 are:

- 2 `{core, events}` v2 points packages
- 2 `{utils}` utility packages
- 3 `iota_liquidlink_profile`-containing packages (profile + like)

### Registry corrections needed

1. **Rename team `points-system` → `liquidlink`.**
   - `id: 'liquidlink'`
   - `name: 'LiquidLink'`
   - `urls:`
     - `{label: 'Website', href: 'https://www.liquidlink.io'}`
     - `{label: 'IOTA App', href: 'https://iota.liquidlink.io'}`
   - `description:` e.g. "Modular on-chain incentive infrastructure —
     points, profile NFTs, referrals, and social engagement on IOTA
     (and Sui) mainnet."
   - File rename: `teams/misc/points-system.ts` →
     `teams/misc/liquidlink.ts` (optional but consistent).

2. **Expand project matches to cover all 11 packages.** Options:
   - **Single LiquidLink umbrella project** with
     `packageAddresses: [all 11]` or a deployer-address match. One
     row, aggregated activity.
   - **Split into sub-products**:
     - `LiquidLink Points (v1)` — `{exact: ['constant', 'event',
       'point', 'profile']}` (current rule, 4 packages).
     - `LiquidLink Points (v2)` — `{exact: ['core', 'events']}`
       (2 packages; but watch for generic-name false positives —
       other teams could ship a `{core, events}` pair).
     - `LiquidLink Profile` — `{any: ['iota_liquidlink_profile']}`
       (3 packages — the branded social profile).
   - **Recommended:** single umbrella row for simplicity, since
     LiquidLink markets as one product.

3. **Update project category** from `Loyalty` to e.g.
   `Incentive / Social` or `DeFi Infrastructure` — matches
   LiquidLink's self-positioning as "on-chain incentive
   infrastructure."

This turns another generically-labeled row into a properly-attributed
project with a known brand, docs, X handle, and multi-chain
deployment context.

## Staking (generic) [x] VERIFIED as TokenLabs (initial investigation below, resolution further down)

Deployer: `0x9bd84e617831511634d8aca9120e90b07ba9e4fd920029e1fe4c887fc8599841`.
Project: Staking.

### On-chain evidence

3 packages at this deployer, all with the identical 3-module
signature `{stake, stake_config, stake_entries}`:

- `0xb6200217…0ed747f`
- `0xaf720252…fd8f799`
- `0xd5c9963e…3e2d47d`

Three upgrade versions of the same standalone staking framework.

### What it actually is — Liquidswap-derived staking library

Module introspection of the latest package reveals a comprehensive
staking framework with classic **Liquidswap-style** module layout
(Liquidswap is an Aptos Move DEX/farming protocol whose
multi-pool-staking module names have been widely reused in the Move
ecosystem):

```
module stake (30 fn, 9 structs):
  structs: StakePool, UserStake, StakeEvent, UnstakeEvent,
           HarvestEvent, DepositRewardEvent, RegisterPoolEvent,
           UpdatePoolDurationEvent, EmergencyEnabledEvent
  key fns: register_pool, stake, unstake, harvest, deposit_reward_coins,
           emergency_unstake, enable_emergency, get_pending_user_rewards,
           accum_rewards_since_last_updated, update_accum_reward,
           update_pool_duration

module stake_config (9 fn, 6 structs):
  structs: GlobalConfig, STAKE_CONFIG, AdminAddressUpdated,
           EmergencyAdminAddressUpdated, TreasuryAdminAddressUpdated,
           GlobalEmergencyEnabled
  key fns: init, set_admin_address, set_emergency_admin_address,
           set_treasury_admin_address, enable_global_emergency,
           is_global_emergency

module stake_entries (15 fn, 0 structs):
  key fns: stake, unstake, harvest, compound, compound_with_extra,
           register_pool, deposit_reward_coins,
           withdraw_reward_to_treasury, emergency_unstake
```

Functions like `accum_rewards_since_last_updated`,
`update_accum_reward`, `compound` / `compound_with_extra`, and the
three-admin structure (regular admin / emergency admin / treasury
admin) are signature Liquidswap / Liquidswap-derived staking
patterns. The framework supports:

- Multi-pool architecture (register N pools, each with its own
  reward token).
- Compound and compound-with-extra staking flows.
- Per-pool lock durations.
- Local + global emergency modes.
- Separate admin/emergency/treasury keys.

### False-match concern — handled by match order

Our current rule `{all: ['stake', 'stake_config']}` would in
principle also match Pools Finance's 10 AMM packages (they vendor
the same Liquidswap-style staking modules alongside their AMM
modules — the 10-module `{amm_*, stake, stake_config, stake_entries}`
signature we saw in the Pools Finance verification). But because
Pools Finance's match rule `{all: ['amm_config', 'amm_router']}`
fires first in the registry's `ALL_PROJECTS` order, those 10
packages get claimed by Pools Finance and never reach the Staking
rule. **No false matches in practice.** Confirmed: this rule
captures only the 3 packages at the `0x9bd8…9841` deployer.

### Public attestation — none found

No dedicated site, no audit, no Medium post, no GitHub repo
mentioning this specific deployer. The function signatures
(`accum_rewards_since_last_updated`, `UserStake`, etc.) are
generic-enough Liquidswap derivations that searching for them
doesn't identify the specific IOTA deployer.

### Plausibility of who owns this

Candidates, ranked by plausibility:

1. **Pools Finance standalone experiment.** They already use this
   staking code vendored into their AMM packages. Deploying it
   standalone (without the AMM) could be an earlier prototype, a
   separate product, or a test deployment. But the deployer address
   `0x9bd8…9841` is **not** in Pools Finance's registered deployer
   list (`0x519e…800c`, `0xeada…88e7`, `0x2130…3542`), so if it's
   Pools Finance, it would be a fourth deployer we haven't
   associated. Medium plausibility.
2. **Independent team using Liquidswap-derived staking.** A builder
   deployed this generic staking framework for their own use (e.g.
   staking their own token) without any public-facing branding.
   Low-to-medium plausibility — three upgrade versions indicate
   real use, but no token/product appears to consume it on mainnet.
3. **Abandoned / exploratory deploy.** Someone tested a staking
   contract and left it live. Possible but three upgrade versions
   works against this.

### Registry status

Attribution stays 🟠 UNVERIFIED. We know **what** it does (classic
multi-pool Liquidswap-style staking framework) and that it has
**real upgrade history** (3 versions). We don't know **who** runs
it.

The current "Staking (generic)" label is an accurate hedge — it
describes the function without over-claiming identity. Don't need
to rename unless we identify the team.

### Registry description correction

Current registry description calls it "Custom staking contracts on
IOTA Rebased with configurable parameters. Enables projects to
offer their own staking programs with custom reward schedules and
entry/exit conditions." That's **approximately right**, but can be
tightened:

> "Liquidswap-derived multi-pool staking framework deployed
> standalone on IOTA Rebased. Provides pool-per-token
> `register_pool` / `stake` / `unstake` / `harvest` / `compound`
> flows with per-pool lock durations and a three-admin (regular /
> emergency / treasury) control model. Identical module structure
> to Pools Finance's vendored staking, deployed separately here;
> owning team unverified. Three upgrade versions."

### Upgrade paths

- **Shared-admin check:** query on-chain for the `GlobalConfig`
  object's `admin_address` field. If it matches Pools Finance's
  admin key, attribution is solved. Requires a probe on the
  specific config object ID.
- **Downstream usage check:** grep on-chain packages for imports of
  `0xd5c9963e::stake::UserStake` or similar — if any token project
  depends on this framework, the relationship identifies the
  customer.
- **Ask IOTA Discord / BIP program list.**

### Resolution — it's TokenLabs (2026-04-17 update)

The "shared-admin check" upgrade path resolved the attribution in
one query. Both avenues of investigation confirmed the same team:
**TokenLabs** ([tokenlabs.network](https://tokenlabs.network)).
Reclassifying this entry as [x] VERIFIED with a full breakdown
immediately below.

## Staking (generic) → TokenLabs [x] VERIFIED (updated attribution)

Actual team: **TokenLabs** — IOTA Rebased validator operator + DeFi
staking platform. Two deployers control a multi-package DeFi stack.

### Attribution resolution

A GlobalConfig probe on the staking framework revealed the
operating admin address:

```
object 0xad0c222b5bfe… (::stake_config::GlobalConfig)
  admin_address:           0x5555679093281ffa85c51c24b55fc45ff0f1bb6a57c0bee2c61eae3d5b54ae7c
  emergency_admin_address: 0x5555679093281ffa85c51c24b55fc45ff0f1bb6a57c0bee2c61eae3d5b54ae7c
  treasury_admin_address:  0x5555679093281ffa85c51c24b55fc45ff0f1bb6a57c0bee2c61eae3d5b54ae7c
  global_emergency:        off
```

The vanity-prefix address `0x5555…ae7c` holds all three admin
roles. Scanning for packages deployed by `0x5555…ae7c` returned 4
additional packages with telling module names:

- `0xb63c0471…` — module `tln_token` (a coin type called
  **TLN_TOKEN** — TokenLabs' native utility token).
- `0xaa560ead…` — module `simple_payment`.
- `0xe4abf8b6…` — modules `{cert, math, native_pool, ownership,
  validator_set}` — a **liquid staking** contract.
- `0x6ab984df…` — same 5 modules (upgrade version of the liquid
  staking package).

Combined with a web search for `"TLN token" IOTA mainnet`, the
project [tokenlabs.network](https://tokenlabs.network) surfaces
immediately:

- **TokenLabs** is "an IOTA Rebased Validator & DeFi Staking
  Platform" (per their own analytics page).
- **$TLN** is their native utility token (fair-launched: 21M cap,
  no presale, 95% community / 5% team emission, decreasing schedule
  from 10,000 TLN/day stepping to a 1,000 TLN/day floor).
- **Token utility loop:** earn TLN by staking IOTA with TokenLabs →
  spend TLN in ecosystem tools (notably **TokenLabs AI**, an AI
  assistant for the IOTA ecosystem) → spent TLN is burned forever
  → supply decreases.
- **X handle:** [@TokenLabsX](https://x.com/TokenLabsX).
- **GeckoTerminal** confirms a TLN/stIOTA pool live on Pools
  Finance at `0x168669080aafe…7320f` (TLN is paired with Swirl's
  stIOTA — cross-protocol DeFi composability).

### On-chain product breakdown

**Deployer `0x9bd8…9841`** — ships the staking framework
(`{stake, stake_config, stake_entries}` × 3 upgrade versions).
These are the staking **engine** packages.

**Admin/Operator `0x5555…ae7c`** — ships the operational product
surface:
- **TLN Token** (`0xb63c0471…`) — `tln_token` module, the coin
  type.
- **Liquid Staking v1 / v2** (`0xe4abf8b6…`, `0x6ab984df…`) —
  `{cert, math, native_pool, ownership, validator_set}` modules.
  This is TokenLabs' **vIOTA** liquid staking product (their
  competitor/alternative to Swirl's stIOTA).
- **Simple Payment** (`0xaa560ead…`) — `simple_payment` module.

**StakePool inventory (7 live pools) reveals the farm structure:**

- TLN → IOTA rewards
- TLN → TLN rewards (self-staking with compound)
- Pools Finance LP tokens (CERT/CERT pair from their AMM) → TLN
  rewards
- LP token farms stacking Pools Finance liquidity + TLN incentives

The pools are keyed by generic types like `StakePool<StakingCoin,
RewardCoin>`, confirming the framework is used for multi-token
multi-pool farming.

### Triangulation

- [x] On-chain admin probe resolves to vanity address
  `0x5555…ae7c`.
- [x] That address deploys 4 additional packages including a
  literally-named `tln_token` module, resolving to TokenLabs'
  native token.
- [x] TokenLabs publicly runs an IOTA Rebased validator + DeFi
  staking platform (tokenlabs.network).
- [x] Module signature and product surface (vIOTA liquid staking +
  TLN farms + TokenLabs AI) match exactly what's on-chain.
- [x] Pools Finance integration confirmed via live TLN/stIOTA pool
  on Pools Finance + LP token farms.
- [x] Only TokenLabs-linked addresses ship these specific packages
  on IOTA mainnet.

Attribution conclusive.

### Side-findings

**TokenLabs ships an alternative liquid staking** (vIOTA) alongside
Swirl's stIOTA. This is a second liquid staking protocol on IOTA
that our registry doesn't surface at all today — the 5-module
`{cert, math, native_pool, ownership, validator_set}` signature
doesn't match any of our current rules (it does **not** match our
dead-def "Swirl Validator" rule, which required `validator` —
TokenLabs uses `validator_set`, different name).

**Swirl Validator dead-def re-explained.** The "Swirl Validator"
project def uses `{cert, native_pool, validator}` and matches zero
packages. We had marked it as dead weight. Now we see that
`{cert, native_pool, validator_set}` exists but at TokenLabs, not
Swirl. Our Swirl Validator def is chasing a module name that
neither team ships. It's genuinely unused and should be removed
from the registry.

### Registry corrections needed

1. **Rename team `staking-generic` → `tokenlabs`.**
   - `id: 'tokenlabs'`
   - `name: 'TokenLabs'`
   - `urls: [{label: 'Website', href: 'https://tokenlabs.network'},
           {label: 'Analytics', href: 'https://tokenlabs.network/analytics'},
           {label: 'X', href: 'https://x.com/TokenLabsX'}]`
   - `deployers: ['0x9bd84e61…', '0x5555679093281ffa85c51c24b55fc45ff0f1bb6a57c0bee2c61eae3d5b54ae7c']`
     — **add the admin/operator address** as a second deployer.
   - `description:` "IOTA Rebased validator operator + DeFi staking
     platform. Issues TLN (native utility token, fair launch, 21M
     cap), operates vIOTA liquid staking, maintains multiple reward
     farms (including stIOTA/TLN integrations via Pools Finance),
     and powers the TokenLabs AI tool. Earn TLN by staking IOTA
     with TokenLabs; TLN is burned per-use in their AI assistant."
   - `category:` DeFi / Validator Platform
2. **Add new project defs:**
   - **TokenLabs Staking Framework** — rename current "Staking"
     project to this; keep current rule
     `{all: ['stake', 'stake_config']}`. Category: DeFi Staking.
   - **TokenLabs Liquid Staking (vIOTA)** — new project with match
     `{all: ['cert', 'native_pool', 'validator_set']}` → 2
     packages. Category: Liquid Staking.
   - **TLN Token** — new project with match
     `{exact: ['tln_token']}` → 1 package. Category: Token.
     (Single-module exact-set match; generic module name "token"
     would false-match, but `tln_token` is specific enough.)
   - **TokenLabs Payment** — new project with match
     `{exact: ['simple_payment']}` → 1 package. Optional — this is
     a small utility, could be folded into an umbrella.
   - Alternative: **single umbrella "TokenLabs" project** using
     deployer-address match (requires scanner change). Would
     simplify to one row.
3. **Remove dead-def `swirlValidator` project** —
   `{all: ['cert', 'native_pool', 'validator']}` matches zero
   packages and was never correct. TokenLabs uses `validator_set`
   not `validator`; Swirl itself doesn't publish these modules at
   all.
4. **Restore attribution status in the verification table** — move
   from 🟠 UNVERIFIED to [x] VERIFIED under name "TokenLabs."

## IOTA Flip / Roulette → IOTA Flip [x] VERIFIED

Deployer: `0xbe95685023788ea57c6633564eab3fb919847ecd1234448e38e8951fbd4b6654`.
Project: Gambling (registry), actually **IOTA Flip** — a gambling
product with coin flip + roulette + raffle games on IOTA Rebased.

### Public attestation

- **Official site:** [iotaflip.netlify.app](https://iotaflip.netlify.app/)
  (Netlify-hosted front-end, wallet-connect interface).
- **Product description:** "Coin flip gambling game with a maximum
  bet of 1,000 IOTA, powered by Move on IOTA Rebased."
- No dedicated .com domain surfaces (Netlify free-tier hosting
  suggests a hobbyist / solo-dev operation — typical for anonymous
  gambling operators on small chains).
- No audit, no whitepaper, no public team identity.

### On-chain evidence — 5 packages, multi-product suite

Deployer `0xbe95…6654` has published **5 packages**:

- **4 upgrade versions** of the core game package with 2 modules
  `{iota_flip, roulette}`:
  - `0x2f6e9f8f…047a78c`
  - `0xd6fefcd9…3579242`
  - `0x809222b0…ded4897a`
  - `0x0ead6546…e2ca89a`
- **1 standalone raffle package** — `0x66a5e577…9b4584d7`, module
  `raffle`. **Currently uncaptured by our rule.**

Module introspection of the latest game package (`0x0ead6546…`):

```
module iota_flip (4 fn, 3 structs):
  structs: IOTA_FLIP, IotaFlipEvent, IotaFlipHouse
  functions: coin_flip, deposit_treasury,
             generate_number_in_range, init

module roulette (7 fn, 5 structs):
  structs: IotaFlipRouletteGameComplete, IotaFlipRouletteHouse,
           ROULETTE, RouletteBet, RouletteBetOutcome
  functions: bet_type_from_args, deposit_treasury,
             generate_number_in_range, init, outcome_match,
             payout_factor, roulette_play
```

The struct names `IotaFlipHouse` and `IotaFlipRouletteHouse` embed
the brand "IotaFlip" directly in the type identifier — the
`roulette` module even prefixes its structs with `IotaFlip`,
confirming both games ship under a unified "IOTA Flip" brand.

**Game mechanics visible in the module:**
- `coin_flip` / `roulette_play` — main gameplay entry points
- `generate_number_in_range` — on-chain randomness helper (likely
  calls IOTA's random beacon or PRG)
- `deposit_treasury` — house-banking deposit flow
- `payout_factor` + `RouletteBet` / `RouletteBetOutcome` — bet
  type abstraction supporting multiple roulette bet types (color,
  number, odd/even, etc.)
- `outcome_match` — settlement logic

Plus the raffle product (separate package): standalone `raffle`
module — presumably a third game where users buy tickets and a
winner is drawn on-chain.

### Triangulation

- [x] [iotaflip.netlify.app](https://iotaflip.netlify.app/) publicly
  runs a coin flip + roulette gambling product on IOTA Rebased.
- [x] Module struct names (`IotaFlipHouse`, `IotaFlipRouletteHouse`)
  literally embed the brand "IotaFlip" in the identifier.
- [x] On-chain product surface (coin flip + roulette + raffle)
  matches the described offering.
- [x] Only one deployer on IOTA mainnet ships `iota_flip` / `roulette`
  modules.

Attribution conclusive.

### Registry undercount — 1 of 5 packages missing

Current rule `{all: ['iota_flip', 'roulette']}` matches 4 of 5
IOTA Flip packages (the 4 game upgrade versions). The **raffle
package is uncaptured** — it's a single-module `raffle` package
that doesn't match any of our current rules.

### Registry corrections needed

1. **Rename team `gambling` → `iota-flip`.**
   - `id: 'iota-flip'`
   - `name: 'IOTA Flip'` (not "IOTA Flip / Roulette" — roulette is
     just one of the games, not part of the brand name).
   - `urls: [{label: 'App', href: 'https://iotaflip.netlify.app'}]`
   - `description:` "On-chain gambling suite on IOTA Rebased —
     coin flip + roulette + raffle games with wallet-connect UI at
     iotaflip.netlify.app. Max 1,000 IOTA per bet. Anonymous
     operator."
   - File rename: `teams/games/gambling.ts` →
     `teams/games/iota-flip.ts` (optional).

2. **Rename project `Gambling` → `IOTA Flip` (and consider
   splitting).**
   - Umbrella approach: one project `IOTA Flip` with
     `packageAddresses: [all 5]` or broader rule that catches both
     the game and raffle packages.
   - Split approach:
     - `IOTA Flip Games` — current rule `{all: ['iota_flip',
       'roulette']}` → 4 packages.
     - `IOTA Flip Raffle` — new rule `{exact: ['raffle']}` → 1
       package. Caution: single-module `raffle` is generic;
       consider tightening via `packageAddresses` or deployer-match.

3. **Update category** from `Gambling` (generic) to e.g.
   `Gambling (Games of Chance)` to differentiate from
   prediction-market / sports-betting categories if we ever add
   those.

### Anonymous-operator note

IOTA Flip has no publicly identified team behind the product. The
Netlify-hosted front-end + anonymous Move deployment is typical for
hobbyist gambling operators. Attribution at the **product** level
is conclusive (the website exists, the contracts match); at the
**team identity** level, it remains anonymous. We label by product
name since that's the only public identity.

## Cyberperp (L1 Move) [x] VERIFIED — NEW PROJECT (not yet in registry)

Deployer: `0x14effa2d3435b7c462a969db6995003cfd3db97f403ad9dd769d0a36413fc3e0`.

Discovered while detective-work-verifying Virtue (above). This
deployer was incorrectly attributed to Virtue in our registry;
turning it over revealed it's actually Cyberperp's L1 Move companion
to their main IOTA EVM deployment.

### Public attestation — gold-standard

The MoveBit audit report for "Cyberperp Audit Report" dated
September 19, 2025 (audit work July 28 – August 22 2025), linked
directly from the official Cyberperp docs audits page
([docs.cyberperp.io/cyberperp/audits](https://docs.cyberperp.io/cyberperp/audits)):

- Report: `https://2030263032-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FtLBb2A1Z76FfXvSnRMiD%2Fuploads%2F1ZaxkaPsRYcKjMTjkCjd%2FCyberperp%20Audit%20Report-2025-10-9.pdf`
- Source repo: `github.com/ttbbio/cyberperp_rebased_contracts`
- Platform: **IOTA** (explicitly stated)
- Language: **Move** (explicitly stated)
- Description quote: "Cyberperp is a decentralized spot and perpetual
  exchange built on the **Iota Rebased**"
- Auditor: MoveBit (same firm that audited Virtue), contact@bitslab.xyz
- Commits audited (5): `0e07e4b0b21f56da68c125021034f2ca111bf304`,
  `220aa1615db19e3e7c0eb389e8e493579b74ed87`,
  `c79baf4aafe08339dba436c084fd98bb61881d56`,
  `579eaf6b139f247caa87415912200`…, `af20bfb7703fe917062177a5e9705deff973642d`

Additionally, CyberPerp's own docs list three audits (two QuillAudits
covering EVM V1 & V2, plus this MoveBit Rebased audit), making the
L1 Move deployment officially disclosed.

### On-chain match

Deployer `0x14ef…c3e0` has published 11 packages, all consistent with
a GMX-style perps exchange (CyberPerp is publicly a GMX fork):

- **4 upgrade versions** of the main trading engine. Each package has
  a 19-module signature: `delegates, liquidity_pool, market,
  price_oracle, pyth, referral, rewards_manager, router_delegates,
  router_liquidity_pool, router_price_oracle, router_referral,
  router_rewards_manager, router_trading, router_vault, trading,
  trading_calc, utils, vault, vault_type`.
- **3 standalone `market`-module packages** (probably per-market
  config packages — one per trading pair).
- **2 DEX / yield-farm packages** with modules `config, router,
  script, swap, utils, yield_farm` (a swap + farming feature).
- **1 CYB token package** with module `cyb` (the L1 Move version of
  the CYB coin type — companion to their EVM CYB token at
  `0xbc51…e8b`).
- **1 LayerZero OFT wrapper** with 14 `oft_*` modules: `oft,
  oft_fee, oft_fee_detail, oft_impl, oft_info_v1, oft_limit,
  oft_msg_codec, oft_ptb_builder, oft_receipt, oft_send_context,
  oft_sender, pausable, rate_limiter, send_param`. This is their
  cross-chain token bridge — lets CYB flow between IOTA Rebased (L1
  Move) and IOTA EVM (L2).

Every package is on-brand for a perps + spot DEX + cross-chain token.
Zero off-topic packages.

### Triangulation

- [x] CyberPerp's own docs link to the MoveBit audit.
- [x] MoveBit audit explicitly names the platform as IOTA Rebased and
  language as Move.
- [x] Source repo is `github.com/ttbbio/cyberperp_rebased_contracts`
  (ttbbio appears to be CyberPerp's dev-team GitHub handle).
- [x] On-chain scan of `0x14ef…c3e0` shows packages whose module
  signature matches a GMX-style perps engine + CYB token + OFT
  bridge — exactly what CyberPerp is.

Attribution conclusive.

### Registry actions needed

Currently the registry has **no** CyberPerp team or L1 project.
CyberPerp only appears as an L2 row via DefiLlama. Its L1 packages are
being misclaimed by Virtue (see the Virtue section above).

To represent CyberPerp correctly on L1:

1. **Create team** `api/src/ecosystem/teams/defi/cyberperp.ts`:
   - `id: 'cyberperp'`
   - `name: 'Cyberperp'`
   - `description`: GMX-fork perps + spot DEX on IOTA Rebased (and
     IOTA EVM).
   - `urls`: `https://cyberperp.io`, `https://docs.cyberperp.io`
   - `deployers`: `['0x14ef…c3e0']`
   - `attribution`: the writeup above.

2. **Create project(s)** in `api/src/ecosystem/projects/defi/`.
   Either one umbrella project or split by product line. Recommended
   split (mirrors on-chain structure):
   - **`Cyberperp Perps`** — main trading engine. Match: `{all:
     ['trading', 'liquidity_pool', 'router_trading']}` (all three
     required, very specific to GMX-style perps).
   - **`Cyberperp Swap`** — DEX / yield-farm. Match: `{all: ['swap',
     'yield_farm', 'router']}`.
   - **`CYB (L1 Move)`** — the token. Match: `{exact: ['cyb']}`.
     Small storage footprint, usually skipped, but worth a row so
     it's not invisible.
   - **`Cyberperp OFT`** — LayerZero OFT bridge wrapper. Match:
     `{all: ['oft', 'oft_impl', 'pausable', 'rate_limiter']}`. More
     specific than the generic LayerZero OFT bucket so this routes
     to CyberPerp, not the catch-all.

   Alternatively, keep it simple with one umbrella `Cyberperp` row
   using `packageAddresses: [all 11]`; scaled-up registries then can
   split later.

3. **Note the L1 / L2 overlap.** The site will then show CyberPerp
   on both the L1 table (from the on-chain Move activity) and the L2
   table (from DefiLlama's `chains: ['IOTA EVM']` entry). That's
   accurate — CyberPerp is genuinely on both layers. Worth a
   sentence in the project description to avoid reader confusion.

---

## Studio 0xb8b1380e 🟡 PARTIALLY IDENTIFIED — multi-brand dev shop (KrillTube + GiveRep + others)

Deployer: `0xb8b1380eb2f879440e6f568edbc3aab46b54c48b8bfe81acbc1b4cf15a2706c6`.

**Huge footprint — 37 packages**, far larger than our 5 registered
projects (Chess, Tic Tac Toe, 2048, Gift Drop, Vault). Detective probe
revealed this deployer ships code for **multiple branded products**,
making it a dev-shop / multi-tenant infrastructure publisher rather
than a single anonymous studio.

### Identified brands (via live-object inspection)

**KrillTube** [x] — Decentralized video platform at [krill.tube](https://krill.tube/).
- On-chain evidence: `tunnel::CreatorConfig` objects carry metadata
  like `"KrillTube Video - eb13e51b-9e01-424a-87a7-ca4e80111218"`.
  Operator address `0xba1e07d0a5db4ed0aab5ada813c3abb8a58f4d34ba19b153f19c70d6e163020d`
  administers the tunnel/KrillTube infrastructure.
- Product: watch-to-earn + upload-to-earn video platform using a
  "Krill" token. Content stored on Walrus (encrypted). Mascot Krilly.
- Packages involved: `tunnel`, `demo_krill_coin` (their token).

**GiveRep** [x] — SocialFi reputation platform at [giverep.com](https://giverep.com/).
- On-chain evidence: `giverep_claim::Pool`, `giverep_claim::SuperAdmin`
  objects shared by multiple users.
- Product: converts social-media engagement (X/Twitter) into on-chain
  $REP points. Launched late April 2025.
- **Primary deployment on Sui**; IOTA is the **secondary deployment**
  (IOTA Foundation's Ambassador Program migrated to GiveRep — their
  IOTA integration is where this deployer's packages come in).
- Confirmed via press coverage: "Over 750,000 $IOTA (~$108K USD)
  distributed to LiquidLink users via GiveRep campaigns" (LiquidLink
  cross-integration — see LiquidLink section for their verification).

### Unbranded products at the same deployer

- **Games portfolio:** Chess (3 versions), Tic Tac Toe (3 versions
  with AdminCap, Treasury, Game, Trophy structs), 2048 Game (with
  campaign_rewards module and RewardCapStore). Multiple individual
  player creator addresses visible as Game creators — these are
  open, anyone-can-play on-chain games.
- **Infrastructure utilities:** vault (multiple variants —
  different creators have their own VaultManagers), gas_station,
  giftdrop_iota (multiple versions).

### Attribution interpretation

This deployer is **not one team with one brand** — it's a **dev
shop or dApp kit publisher** servicing multiple products. The
relationship between KrillTube, GiveRep (IOTA side), and the games
portfolio could be:

1. **Single team, multiple products.** Same dev team iterates on
   GiveRep, launches KrillTube, ships on-chain games as a showcase
   / hackathon outputs.
2. **Dev shop operating multiple clients.** One technical team
   with several product brands using the shared deployer key.
3. **Shared IOTA Foundation-adjacent infrastructure.** The IOTA
   Foundation's Ambassador Program uses GiveRep on IOTA; KrillTube
   may be another IF-affiliated product; the deployer could be an
   IF-adjacent contractor.

Without a direct public statement tying the deployer to a specific
team, we can't pick definitively among these. But the **brands are
identified** — KrillTube and GiveRep are real, public, and both
use this deployer.

### Registry corrections needed

1. **Split into multiple team entries** — the current synthetic
   `studio-b8b1` label lumps too much together.
   - `krilltube` team → Chess Tic Tac Toe 2048 Gift Drop Vault
     may NOT belong here; those are probably separate. The
     KrillTube-specific packages are the `tunnel` + `demo_krill_coin`
     packages. Team URL: https://krill.tube/.
   - `giverep` team → the `giverep_claim` packages. Primary
     product site: https://giverep.com/.
   - Retain **`studio-b8b1`** as a fallback catch-all for the
     game packages and other infrastructure that doesn't clearly
     belong to a branded product. Keep deployer address; tag as
     "shared-infrastructure deployer" rather than single-brand
     team.

2. **Add new project defs:**
   - **KrillTube** → match `{any: ['tunnel']}` or
     `packageAddresses: [...]`. The `tunnel::CreatorConfig` and
     `demo_krill_coin` packages.
   - **GiveRep** → match `{any: ['giverep_claim']}`. The pool +
     admin packages.

3. **Update status** from ⚫ ANONYMOUS to 🟡 PARTIALLY IDENTIFIED
   (brands known, overall team ownership of the deployer still
   unconfirmed).

### Unresolved question

We can't distinguish whether the games (Chess / Tic Tac Toe / 2048)
are:
- Developed by the same KrillTube/GiveRep team.
- Published by independent game developers using the same deployer
  because they happen to share infrastructure.
- A hackathon-style dApp showcase bundled into one deployer.

Upgrade path: inspect a game `AdminCap` owner — if it points to the
KrillTube operator `0xba1e07…20d` or the deployer itself, that's a
single-team answer. If the games have distinct AdminCap holders,
they're independent.

On our earlier probe: `tic_tac_iota::AdminCap` is owned by the
deployer itself (`0xb8b1380e…`), and Chess/2048 Treasury objects
are shared. That suggests the deployer directly administrates the
games (not handed off to other teams). Leans toward "single team
behind KrillTube + GiveRep + games," but not conclusive.

## Studio 0x0a0d4c9a 🟠 STILL UNVERIFIED — 3 distinct product lines, no brand match yet

Deployer: `0x0a0d4c9a9f935dac9f9bee55ca0632c187077a04d0dffcc479402f2de9a82140`.

**33 packages** covering three distinct product lines, all administrated
by the deployer itself (every AdminCap/GuardianCap/OracleCap
inspected is owned by the deployer address). No third-party creator
objects visible — this looks like a **single-team private
deployment** rather than a multi-tenant framework.

### Three product lines identified on-chain

1. **Token launchpad / sale platform** (`Spec` family):
   - `spec_packs::Global` (with admin reference to deployer)
   - `spec_sale_v2::Sale` + `AdminCap` / `GuardianCap` / `OracleCap`
   - `spec_sale_multicoin::Sale` (multi-coin-purchase variant)
   - Architecture: Admin + Guardian + Oracle 3-key permission model,
     paired with a Sale object. Classic launchpad/ICO-style token
     distribution infrastructure.

2. **Token + swap gateway** (`Claw` family):
   - `claw_coin` (single-module coin package)
   - `claw_swap_gateway::Gateway` + AdminCap/GuardianCap/OracleCap
   - Same 3-key permission pattern as Spec
   - Suggests Claw is **their own utility token** with a swap
     gateway letting users exchange between Claw and other tokens.

3. **Commerce / services marketplace** (no unique brand name
   found — large module list):
   - 17-18 modules per package: `admin, bond, deadline_ext,
     dispute_quorum, errors, escrow, listing_deposit,
     manifest_anchor, milestone_escrow, mutual_cancel,
     order_escrow, order_mailbox, payment_assets, reputation,
     review, rewards, tier`
   - Architecture matches a decentralized freelance/services
     marketplace with milestone-based escrow, dispute quorum,
     reputation system, reviews, tiered rewards, and order
     workflow.
   - **Similar in architecture to Aegora** (a decentralized
     arbitration/trust marketplace), but Aegora proper is on
     U2U Solaris Mainnet, not IOTA. Our IOTA deployment is either
     an independent parallel project OR a port, attribution
     unresolved.

### Why the brand(s) can't be identified

Unlike Studio b8b1 (where KrillTube metadata and GiveRep module
names leaked into Move objects), Studio 0a0d's objects contain only
the deployer's own address as admin — no creator-written brand
strings, no domains in config, no operator addresses tied to named
identities. The modules' names (`claw_coin`, `spec_sale`, etc.) are
either test names or internal abbreviations not yet publicly
surfaced.

Web searches for `"Claw" IOTA` return unrelated tokens on Solana /
Ethereum / BSC / Base; `"spec_sale" IOTA` returns nothing relevant.
No IOTA blog, showcase page, or Business Innovation Program
participant publicly matches this deployer's product suite.

### Plausibility

Three coordinated product lines (sale/launchpad + token/swap +
commerce-marketplace) at a single deployer with all admin caps
held by that same deployer suggests a **single small team with
stealth ops** — building multiple products simultaneously, not yet
ready to launch publicly. Common pattern:

- A team deploys their own token + sale infrastructure + commerce
  platform to mainnet ahead of a public launch.
- Before the brand is public, everything looks anonymous on-chain.
- Once launched, all three could become attributable via a single
  announcement.

### Registry status

Remains 🟠 UNVERIFIED. On-chain evidence clarifies **what** exists
(three product lines) but not **who** runs it. The current synthetic
label "Studio 0x0a0d4c9a" appropriately hedges.

### Registry corrections needed (minor)

1. **Add more project defs to surface the uncaptured packages.**
   Current rule `{all: ['dispute_quorum', 'escrow']}` (Marketplace
   Escrow) catches the 17/18-module marketplace packages. Current
   rule `{any: ['spec_sale_multicoin', 'spec_sale_v2']}` (Token
   Sale) catches spec sales. But:
   - `claw_coin` single-module package → currently unattributed.
   - `claw_swap_gateway` → currently unattributed.
   - `spec_packs` → currently unattributed.
   - Variants with `payment_assets` / `order_payment_assets` /
     `onchain_asset_lane_manager` / `payment_core_asset_lanes` are
     separate packages that may or may not be part of the main
     commerce platform — worth investigating their module lists.

2. **Status tagging.** Note in the registry comment that this
   deployer ships an in-progress multi-product suite; attribution
   pending public launch.

### Upgrade paths

- Monitor IOTA Business Innovation Program announcements for a new
  launchpad / token / commerce brand.
- Check if any Move packages outside this deployer link into
  `spec_sale_v2` or `claw_swap_gateway` via their `linkage`
  (dependency graph) — would reveal customers.
- Ask in IOTA Discord about `spec_packs` and `claw_coin` — the
  names are specific enough that ecosystem insiders may know.

### Summary comparison

| Studio        | Packages | Identity                                                   | Status                          |
|---------------|----------|------------------------------------------------------------|---------------------------------|
| `studio-b8b1` | 37       | KrillTube + GiveRep + games + shared infra                 | 🟡 partial (brands found)       |
| `studio-0a0d` | 33       | 3 product lines (Spec, Claw, Marketplace), no public brand | 🟠 unverified (wait for launch) |

Unlike every other team we've investigated, Studio 0a0d is the one
case where the object-probe technique **didn't** break the
attribution. The team apparently keeps everything in-house with no
third-party users (no `creator_addr` leaks, no `linked_domain`
fields, no content URLs). If they launch publicly later, we can
attribute then.

---

# Aggregate bucket sections (no single team)

## NFT Collections (aggregate)

Project has `teamId: null` and `splitByDeployer: true`. Not a team
attribution per se — each matching deployer becomes a per-deployer
sub-project. Display names enriched with an NFT `tag`/`name`/
`collection_name` field sampled on-chain.

Sub-project routing: if a deployer belongs to a single-project team
(currently only `if-testing`), the sub-project routes there;
otherwise the sub-project stays in the bucket as
`NFT Collections: <sampled-tag> (<hash>)` or
`NFT Collections (deployer-<hash>)`.

No verification to do here — the "team" is explicitly indeterminate
by design.

## LayerZero OFT (aggregate)

Project has `teamId: null` and `splitByDeployer: true`. OFT is a
contract pattern; any team can deploy their own OFT token package.
Each deployer becomes its own sub-project; known teams (e.g. Virtue
for wOFT) get team-deployer-routed.

No attribution needed for the bucket itself. Individual sub-projects
inherit verification status from whichever team they're routed to.
