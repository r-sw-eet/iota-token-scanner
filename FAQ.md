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
