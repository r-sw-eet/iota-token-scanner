# TLIP address-level provenance — investigation

## Goal

Find any public document that **directly names** the TLIP Move
package address
`0xdeadee97bb146c273e9cc55ec26c1d2936133119acc1b2fc0b542e279007e108`
or deployer
`0xd7e2de659109e51191f733479891c5a2e1e46476ab4bafe1f663755f145d5176`.

TLIP is already verified at the organizational level (see
`handoff.md` → "IOTA Foundation (TLIP) [x] VERIFIED"). This thread is
about closing the last remaining address-specific provenance gap.

## What I checked

### 1. wiki.tlip.io (Docusaurus site, hosted from `tmea-tlip/wiki.tlip.io`)

Fetched all 45 markdown files in `docs/` recursively from the GitHub
raw endpoint. Grepped the full corpus for:

- `0x[a-fA-F0-9]{4,}` — **zero matches** (no hex addresses of any kind).
- `deadee`, `d7e2de` — zero matches.
- `ebl`, `carrier_registry`, `endorsement`, `interop_control`,
  `Move.toml`, `package` (as on-chain concept) — zero matches.
  `package` appears only as "npm package" / "node.js workspace
  package".

Section-6 ("Developer Guide") and section-4 ("Setting up dev
environment") are the most technical pages, but they describe the
node.js / IPFS / MySQL stack, not on-chain contracts.

Notably, section-6/sub-section-5 ("IOTA Blockchain") is still
written for the **legacy IOTA 1.x stack** — it describes IRI nodes
and MAM channels, and states:

> "The TLIP platform is currently being developed using the IOTA Devnet."

So the wiki predates the IOTA Rebased (Move) migration and has not
been updated with any Move-era deployment information. This is the
root cause of the address gap — the published docs haven't caught
up with the Rebased-mainnet deployment.

Individual pages verified via WebFetch:

- `wiki.tlip.io/docs/section-6/overview` — no addresses.
- `wiki.tlip.io/docs/section-6/sub-section-1` (System Architecture) — no addresses.
- `wiki.tlip.io/docs/section-6/sub-section-3` (Building Blocks) — no addresses.
- `wiki.tlip.io/docs/section-6/sub-section-4` (IOTA Nodes) — no addresses.
- `wiki.tlip.io/docs/section-6/sub-section-5` (IOTA Blockchain) — no addresses.
- `wiki.tlip.io/docs/section-6/sub-section-6` (IOTA network in the system) — no addresses.
- `wiki.tlip.io/docs/section-1/overview` — no addresses.

### 2. GitHub org `tmea-tlip`

Public repo list (no auth needed): **5 repos**, none of them contain
Move code.

- `www.tlip.io` (Svelte) — marketing site
- `wiki.tlip.io` (JavaScript/Docusaurus) — docs (checked above)
- `private-ipfs` (Shell) — IPFS launch scripts
- `new-merkle-tree` (Shell) — one-click-tangle merkle migration
- `nginx-reverse-proxy` — reverse-proxy instructions

No `Move.toml`, no mainnet deployment config, no test fixtures
referencing a package address. GitHub code search
(`0xdeadee97 org:tmea-tlip`, `0xd7e2de65 org:tmea-tlip`,
`ebl org:tmea-tlip`) requires authentication, so I couldn't
exhaustively code-grep, but the repo list itself tells the story:
**TLIP's Move contracts are not open-sourced in this org.**

### 3. IOTA Foundation hosted assets

- `files.iota.org/comms/TLIP_IOTA_Showcase_Presentation.pdf` —
  downloaded and extracted with `pdftotext`. Full text has 1
  mention of "mainnet" ("TLIP nodes are built on the IOTA
  mainnet"), zero hex addresses.
- `files.iota.org/comms/tlip_brochure.pdf` — same result: zero hex
  addresses.
- `blog.iota.org/tlip-website/` — no addresses.
- `blog.iota.org/q12025-progress-report/` — mentions KRA set up a
  TLIP node, no addresses.
- `blog.iota.org/iota-2025-review/` — single TLIP mention, no
  addresses.

### 4. Medium (`@tlip.io` publication) and partner coverage

- `medium.com/@tlip.io/about` — no addresses, no linked posts from
  the About page itself.
- `medium.com/@tlip.io/what-is-tlip-ee40c0127100` — no addresses.
- MISSION project Medium post — no addresses.
- `www.tlip.io/about-us` — no addresses, no on-chain refs.

### 5. Direct web searches

- `"0xdeadee97bb146c273e9cc55ec26c1d2936133119acc1b2fc0b542e279007e108"` — 0 hits mentioning TLIP.
- `"0xd7e2de659109e51191f733479891c5a2e1e46476ab4bafe1f663755f145d5176"` — 0 hits mentioning TLIP.
- `"0xdeadee97" TLIP IOTA` — 0 hits linking the prefix to TLIP.
- `"tlip.io" "Rebased" OR "IOTA Move" mainnet 2025` — surfaces the
  Q1 2026 launch timeline, nothing address-specific.
- `"deadee" IOTA Rebased package vanity` — no hits.

### 6. IOTA explorer metadata

`explorer.iota.org/address/0xd7e2de…5176` — the explorer page is a
client-rendered SPA, so WebFetch only saw the page title. No
server-rendered label/tag surfaces (and the IOTA explorer generally
doesn't publish project tags the way Etherscan does).

## Addresses found

**None.** No public document directly names
`0xdeadee97…7e108` or `0xd7e2de…5176` as TLIP-operated.

## Attribution upgrade verdict

**No upgrade.** The attribution stays at the level already documented
in `handoff.md`: organizational-grade triangulation (IOTA Foundation
endorsement + tlip.io + wiki.tlip.io + tmea-tlip GitHub org + module
signature match `{ebl, carrier_registry, endorsement,
interop_control, notarization}` + vanity-prefix deployer), with the
address-specific publication gap left as-is.

### Key structural reasons the gap exists

1. **Published docs predate Move migration.** The TLIP wiki still
   describes the IOTA 1.x stack (IRI nodes, MAM channels, Devnet).
   It has not been updated for IOTA Rebased / Move, so there is
   simply no section where a Move package address *would* live.

2. **TLIP's contracts are not open-sourced in `tmea-tlip`.** The
   GitHub org has only infrastructure and docs; no `Move.toml`, no
   smart-contract repo. Whichever internal repo houses the eBL /
   carrier_registry / endorsement modules is private.

3. **Mainnet deployment is still pre-launch in public
   communications.** The current public narrative
   (`crypto-newsmedia.com`, community commentary) says TLIP *may*
   launch on mainnet in **Q1 2026** — even though `0xdeadee97…` was
   already deployed on mainnet before that article. Matches the
   pattern where the package is deployed early for testing while
   marketing-comms still say "upcoming launch".

4. **TLIP's audience is governments and shipping integrators, not
   Move devs.** They interact via `api.tlip.io` (REST), so there is
   no product-side incentive to publish the package address.

### Gap ownership

The gap is **TLIP's publication practice, not ours.** The chain of
evidence we already rely on (module-name fingerprint + vanity prefix
+ IOTA Foundation organizational endorsement + narrow deployer
scope: 1 package, 5 TLIP-specific modules) is enough for a
confident attribution.

No further action required on this thread unless/until TLIP updates
their wiki for the Rebased era or open-sources the contract repo.

## Files touched

- `thread-tlip-address.md` (this file) — created.
- No other files modified.
