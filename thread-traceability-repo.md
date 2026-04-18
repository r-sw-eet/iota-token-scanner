# IOTA Traceability — canonical repo search

## Goal

Find a canonical IOTA Foundation GitHub repository for the
Traceability product on `iotaledger/*`, analogous to
`github.com/iotaledger/notarization/tree/main/notarization-move`.
Current attribution rests on organizational grounds (product page
endorsement + 3-deployer coordination), but the address-to-repo
link that closes Notarization hasn't been established.

## What I checked

1. **GitHub org search — `iotaledger` repositories, filter
   "traceability":** `https://github.com/orgs/iotaledger/repositories?q=traceability`
   returned **0 repositories**. No repo in the org has "traceability"
   in its name or description.
2. **Full repo listing** across pages 1-4 (~107 repos total):
   pages 1-4 yielded ~77 visible names; none are `traceability`,
   `trace`, `supply-chain`, or `provenance`. The closest product-ish
   names are `notarization`, `hierarchies`, `identity`, `product-core`,
   `starfish`, `dpp-demonstrator`, `iota-supply-service`, `selv`.
3. **iota.org/products/traceability** — fetched the full page. It
   links to generic `https://github.com/iotaledger` (social footer)
   and the generic `docs.iota.org` developer pages. **No dedicated
   repo link**, unlike Notarization's product page which points to
   `iotaledger/notarization`.
4. **docs.iota.org** — site search for "traceability" returned no
   dedicated traceability documentation page. The URL
   `docs.iota.org/developer/iota-101/move-overview/traceability`
   returns 404.
5. **Trust Framework page (`iota.org/learn/trust-framework`)** —
   does **not** mention "traceability" by name. Closest concept is
   "product tracking and provenance" under the Digital Identity
   use case. No repo links.
6. **Google searches:** `"iotaledger traceability move"`,
   `"iota.org" traceability github iotaledger repo`,
   `"module traceability::traceability" iota`,
   `site:github.com iotaledger traceability`, and variants. All
   returned the usual suspects (`iota`, `identity`, `notarization`,
   `hierarchies`) but **no repo match** for a traceability module.
7. **Cross-deployer address search** —
   `"0xee5e416d" OR "0x288042cc" OR "0xa8eef587"` combined with
   "iota foundation traceability": **zero indexed hits**. The 3
   deployer addresses are not published anywhere the search engines
   have indexed.
8. **Candidate repos I inspected in detail:**
   - `iotaledger/dpp-demonstrator` — Digital Product Passport
     demonstrator. Contract is a Move package named
     **"IOTA Custom Notarization"** with modules
     `audit_trails, lcc, lcc_reward, nft_reward`. Depends on
     `hierarchies-move`. **Module name does not match the on-chain
     single-module `traceability` packages** — this is a different
     demo product, not the canonical Traceability source.
   - `iotaledger/hierarchies` — trust hierarchies (federations,
     accreditations, attestations). No `traceability` module.
   - `iotaledger/product-core` — shared Rust + Move components for
     IOTA products. `components_move` exposes RBAC / capability /
     time-restriction utilities. No `traceability` module.
   - `iotaledger/iota-supply-service` — unrelated: a REST service
     exposing **IOTA token supply** (circulating / total), not
     supply-chain. Rust-only, no Move.
   - `iotaledger/iota` monorepo `examples/` folder — contains
     `custom-indexer`, `move`, `tic-tac-toe`, `trading`. No
     `traceability` example.

## Repo found

**None.** There is no `iotaledger/traceability` repository, no
traceability-named Move package in any adjacent iotaledger repo,
and no docs page on docs.iota.org that points to one. The closest
thematic repo is `iotaledger/dpp-demonstrator`, but its Move
package is "IOTA Custom Notarization" with an `audit_trails`
module — structurally unrelated to the single-module `traceability`
packages observed on mainnet.

## Attribution verdict

**Attribution stays [x] on organizational grounds.** The original
assessment in `handoff.md` holds — no further evidence was
unearthed that would either strengthen it to "direct address-to-
repo match" or weaken it.

The strongest attribution facts remain:

1. **IOTA Foundation publicly endorses the product** at
   `iota.org/products/traceability`.
2. **3 deployers ship 6 identical single-module `traceability`
   packages** — a pattern (multi-deployer, identical minimalist
   contract, generic module name) consistent with a coordinated
   per-customer deployment campaign that only IF is plausibly
   positioned to run.
3. **`traceability` is a unique module name on IOTA mainnet** — no
   other deployer ships it, so the registry rule
   `{all: ['traceability']}` cleanly captures the product without
   false positives.
4. **No competing organization has surfaced** that could coordinate
   this pattern; the product page endorsement makes IF the only
   plausible orchestrator.

The gap (no published iotaledger repo) is best explained by the
deployment model hypothesis in `handoff.md`: Traceability is
deployed **per-customer** from an internal IF deployer pool, not
from a single canonical open-source repo. This also explains why
the product page omits a developer/repo link — the productized
offering is closer to a managed service (like TLIP) than to a
self-serve Move library (like Notarization).

### Follow-up that could still close the gap

- Ask IOTA Discord directly whether a canonical Traceability repo
  exists (it may simply not be indexed yet or live under a
  non-`iotaledger` org like `tmea-tlip` or an IF enterprise
  account).
- Watch for IF blog posts announcing a Traceability SDK release
  (would ship with a repo link).
- Re-run the org repo scan in a few months — IF may open-source the
  product later, matching the Notarization trajectory.

Until then, the 3-deployer pattern + product-page endorsement is
the best available grounding, and Traceability's [x] VERIFIED
status in `handoff.md` remains correct.
