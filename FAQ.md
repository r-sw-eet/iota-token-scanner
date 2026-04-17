# FAQ

Collected questions and answers, intended to become a website FAQ section later.

---

## Why do some L1 (Move VM) projects have TVL? Isn't TVL an EVM/L2 thing?

No. **TVL just means "total value locked"** — the dollar value of user funds a protocol holds. Any protocol that takes deposits has TVL, regardless of which VM it runs on.

Examples on IOTA L1 (Move VM):

- **Virtue** — CDP stablecoin protocol (locks IOTA as collateral, mints stables)
- **Swirl** — liquid staking (locks IOTA, issues LSTs)
- **Pools Finance** — lending market (locks IOTA as collateral / supply)

These behave exactly like their EVM counterparts on Aave, Lido, MakerDAO — same use cases, different VM. DefiLlama tracks them in the same `/protocols` feed, just tagged with `chains: ['IOTA']` instead of `chains: ['Ethereum']` etc.

The scanner fetches the DefiLlama feed during the 6-hour ecosystem scan (`api/src/ecosystem/ecosystem.service.ts:483`), filters to protocols on `IOTA` or `IOTA EVM`, and grafts the TVL number onto whichever curated L1 project matches by name. That's why you see TVL columns populated on some L1 rows.

We read the **IOTA-chain slice only** (`chainTvls['IOTA']` for L1, `chainTvls['IOTA EVM']` for L2), not the protocol's cross-chain total. A multi-chain protocol that happens to be deployed on IOTA will only contribute its IOTA-side locked value — never its Ethereum or Solana bags. If a matched protocol has no IOTA slice at all, its TVL is left blank.

---

## How do you identify which project a package belongs to? And how do projects get linked to a team?

Identification works differently on each layer.

### L1 (Move VM) — curated registry + on-chain probes

Every mainnet package discovered by the scanner runs through a matcher (`api/src/ecosystem/ecosystem.service.ts:284`) against a hand-curated registry in `api/src/ecosystem/projects/`. Each `ProjectDefinition` declares how to claim packages via a `match` block. The matcher tries, in this priority order:

1. **`packageAddresses`** — exact lowercase match on a known published address. Strongest signal, used when module names are too generic to match reliably (e.g. staking on `0x3`).
2. **Module-set predicates** — `exact` (module set equals a fixed list), `all` (has every listed module), `any` (has at least one), `minModules` (at least N modules). Good for projects with distinctive module names.
3. **`fingerprint`** — if no static rule matches, the scanner samples one Move object of type `<pkg>::<type>` via GraphQL and checks fields like `issuer` / `tag`. This is what auto-discovers *new* packages for a project we already know about, without us having to hand-list every address.

The order of `ALL_PROJECTS` in `api/src/ecosystem/projects/index.ts` is the tiebreak — more specific defs come first. Framework packages (`0x1`–`0x3`, …) are skipped by default, unless explicitly claimed via `packageAddresses`.

Some projects are **aggregate buckets** (e.g. "NFT Collections", "2048 clones"). These set `teamId: null` and often `splitByDeployer: true`, which fans one bucket match out into one sub-project per distinct deployer address — so we don't collapse a dozen different NFT drops into a single row.

### L1 — team attribution

Teams live in `api/src/ecosystem/teams/`. Each `Team` has a list of known mainnet `deployers` (addresses that publish its packages). After a package is matched to a project, the scanner:

1. Looks up the project's `teamId` and attaches the team snapshot (name, website, socials, logo).
2. Records every address that actually deployed a matched package under `detectedDeployers`.
3. Flags any `detectedDeployers` not present in the team's known-deployer list as `anomalousDeployers` — worth inspecting, usually either a new team address we should add or a mis-attribution.

For aggregate buckets with `teamId: null`, we still try `getTeamByDeployer(deployer)` — if the deployer belongs to a single known team, the sub-project is routed to that team rather than left unattributed.

### L2 (IOTA EVM) — DefiLlama only

We do no on-chain scanning on L2. The list is pulled from DefiLlama's `/protocols` feed, filtered to protocols tagged `chains: ['IOTA EVM']`, name-deduped against the L1 list, and surfaced as L2 rows with slug `evm-<llama-slug>`. Identification here is just "DefiLlama says it's on IOTA EVM" — no team linkage, no deployer introspection.
