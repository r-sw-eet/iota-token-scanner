# Thread: IOTA Foundation (Testing) — public-attribution pass

## Goal

Close (or confirm as unclosable at this time) the one remaining 🟡
among IF-labeled products: find *any* public source that names one of
the three suspected IF-test-deployer addresses as IOTA-Foundation-
operated. A single hit (GitHub commit, config file, test fixture,
blog post, deployment doc) would upgrade the attribution from 🟡
CIRCUMSTANTIAL to [x] VERIFIED.

## Addresses searched

- `0xb83948c6db006a2d50669ff9fc80eef8a3a958bd3060050865fe9255fa4e5521` (45 packages)
- `0x278f2a12f9cb6f2c54f6f08bad283c3abc588696fadff6cf9dd88fd20019afeb` (17 packages)
- `0x164625aaa09a1504cd37ba25ab98525cf2e15792f06a12dd378a044a0d719abe` (17 packages)

All three searched verbatim, in quoted form, with and without the
`0x` prefix.

## What I did

1. **Verbatim WebSearch** for each of the three addresses (quoted).
   No hits — only unrelated Ethereum/Base/Arbitrum explorer rows
   surfaced as fallback suggestions.
2. **`site:github.com` scoped WebSearch** for each address. Zero
   indexed results across all three.
3. **IOTA-context WebSearch** (`"<address>" iota`) for each. Only
   generic IOTA docs homepages returned; no address-specific match.
4. **IOTA Foundation repos probed directly** via WebFetch:
   - `iotaledger/gas-station` (active repo, was `iota-gas-station`)
     — `docs/`, `examples/`, `sample_kms_sidecar/`. Sample configs
     use placeholder addresses (`0x01…01`, `0x02…02`,
     `0xa2e1…f2311`, `0xe307…8d7f5`, `0x8a7f…f91bd`, `0xb674…ae26`).
     None match our three.
   - `iotaledger/gas-station/docs/access-controller.md` and
     `common-issues.md` — no match.
   - `docs.iota.org/operator/gas-station/deployment/` — no match.
   - `blog.iota.org/iota-gas-station-alpha/` — no match, and notably
     states *"The IOTA Foundation currently does not operate a Gas
     Station for commercial use."*
5. **Authenticated GitHub code search** on `org:iotaledger` and
   `iotaledger/iota` — requires login; anonymous WebFetch returns
   the sign-in wall.
6. **Alternative code-search engines**: grep.app and searchcode.com.
   grep.app sits behind a Vercel bot-challenge that `curl`/`WebFetch`
   can't clear; searchcode.com rendered only marketing copy for its
   MCP server. No results obtainable.
7. **Tag-vocabulary pivot** — searched `"gas_station_basic"`,
   `"transfer_test"`, `"regular_comparison"` in IOTA context. This
   surfaced an unexpected lead: **TWIN Foundation**
   (`twinfoundation/*` on GitHub, blog post `twin-foundation-
   launched/`). TWIN was co-launched May 2025 by the IOTA
   Foundation + 5 partners (World Economic Forum, Tony Blair
   Institute, etc.), is built on IOTA, and publishes a
   `twinfoundation/twin-gas-station-test` Docker image on Docker
   Hub. Their `nft-connector-iota` package's test suite explicitly
   depends on "Test IOTA Gas Station" instances.
8. **TWIN repo probe**: `api.github.com/orgs/twinfoundation/repos`
   returns a **single** public repo (`.github`, a profile repo).
   The `twinfoundation/identity`, `twinfoundation/nft`, etc. URLs
   referenced by `twindev.org` docs all 404 — those repos are
   private. No grep pass possible.
9. **Direct doc dive** at `twindev.org/docs/pkgs/nft/packages/nft-
   connector-iota/` — page 404s when fetched; Google snippet
   mentions env variables like `TEST_GAS_STATION_URL` and
   `TEST_GAS_STATION_AUTH_TOKEN` but no specific package/deployer
   address.
10. **IOTA Explorer** for the primary address returned only the
    bare "IOTA Explorer" shell (SPA, content loads via JS).

## What I found

- **No public document names any of the three addresses.** Full
  stop. Not in `iotaledger/*` public repos, not in the IOTA blog,
  not in the operator docs, not in TWIN Foundation's public surface,
  not via general web search.
- **New adjacent lead surfaced: TWIN Foundation.** Their testing
  nomenclature (`twin-gas-station-test`, gas-station-dependent NFT
  connector tests) lines up strikingly well with the on-chain tag
  vocabulary we see on our three deployers (`gas_station_basic`,
  `transfer_test`, `regular_comparison`). TWIN is IOTA-Foundation-
  co-founded and IOTA-native. This is a better pattern match than
  "generic IF internal testing" — the three deployers might be
  **TWIN Foundation test wallets** rather than (or in addition to)
  IOTA Foundation ones.
- **TWIN's code repos are private**, so we can't grep them for the
  addresses. The public `twinfoundation` GitHub org only exposes
  `.github`.

## Attribution status

Stays **🟡 CIRCUMSTANTIAL**. No public attestation was found.

However, the investigation surfaced a refinement worth noting:

- The label "IOTA Foundation (Testing)" may be *narrower* than
  reality. The tag vocabulary plus gas-station dependency is a
  much cleaner fit for **TWIN Foundation testing** than for IF
  itself. TWIN is IF-co-founded and IF-adjacent, so the parent
  label isn't wrong, but "IOTA Foundation + TWIN Foundation
  (Testing)" or simply "TWIN Foundation (Testing)" would be more
  accurate if confirmed.
- This is a lead worth keeping on the thread, not an upgrade. TWIN
  co-launching in May 2025 aligns temporally with gas-station
  alpha.

## Concrete next steps (ordered by effort)

1. **Low effort — re-run this search periodically.** Public code
   indexers (grep.app, public-archive snapshots of GitHub search)
   may pick up these addresses if/when any IF or TWIN repo that
   references them is made public. Worth a 6-month recheck.
2. **Low effort — ask in IOTA Discord / TWIN Discord.** Post the
   three addresses in `#dev` and ask whether they are IF-internal
   or TWIN-internal test wallets. Community mods have answered
   similar "whose deployer is this" questions in the past.
3. **Medium effort — authenticated GitHub code search.** Log in
   with any GitHub account and run
   `org:iotaledger "b83948c6db006a2d50669ff9fc80eef8a3a958bd3060050865fe9255fa4e5521"`
   (and the other two). The public search API is auth-gated, not
   auth-restricted — any logged-in user can query all public repos.
4. **Medium effort — probe TWIN Foundation directly.** Their
   contact channel is on `twindev.org`. A single question ("are
   these three deployers your test wallets?") resolves the thread
   if answered.
5. **High effort / low value — browser-based probe of
   `twindev.org`.** The docs site 404s on WebFetch but works in a
   real browser; a Playwright walk-through of the `nft-connector-
   iota` and `identity-connector-iota` package pages might surface
   a concrete mainnet package-id that ties back to one of these
   deployers.

## Disposition

No registry change needed. The `handoff.md` section on IF (Testing)
already flags the attribution as 🟡 CIRCUMSTANTIAL with all the
caveats. This investigation confirms that state and adds one new
hypothesis (TWIN Foundation involvement) worth tracking.

The existing "Upgrade paths" list in `handoff.md` (gas-station
retrospective, commit grep, visibility demotion) is still correct.
Add: **"Probe TWIN Foundation"** as a fourth upgrade path.
