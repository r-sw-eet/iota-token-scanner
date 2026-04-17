# Project Mapping

This document is the ground-truth map from **on-chain evidence** (IOTA mainnet) to **displayed project names** (as shown on iota-trade-scanner.net). Every L1 row on the site reaches its pretty label through one of these entries. Source of truth for the code lives under `api/src/ecosystem/projects/` and `api/src/ecosystem/teams/`.

For a higher-level explanation of *how* identification works, see [FAQ.md — How do you identify which project a package belongs to?](FAQ.md).

## Reading this doc

Each project row shows:

- **Display name** — the string rendered in the UI. Hand-chosen in a `ProjectDefinition.name` field. *This string does not exist on mainnet.*
- **On-chain match** — the actual strings read from IOTA mainnet that trigger the match. Every cell is annotated with **where** on-chain that string lives — see the legend below.
- **Rule** — which matcher fired (`module:all`, `module:any`, `module:exact`, `module:minModules`, `address`, `fingerprint`).
- **Team** — the team label attached to the row (another hand-chosen string, from `Team.name`).
- **Sources** — public surfaces we used as attestation that this project is actually live on IOTA mainnet. Website, docs, or press pages from the project itself or from the IOTA Foundation. *When a project has no public source yet, the Sources column is `—`; the match is still valid (the code shipped), but third-party verification of the branded identity isn't linked.*

### Where on-chain a match string can live

| Annotation            | What it is                                                                                                                                                                          | Graphql field / location                           |
|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|
| **module**            | A Move module identifier (name of a `.move` file) compiled into the published Move **package**. The same package contains 1..N modules. Hardcoded by the developer at publish time. | `packages.nodes.modules.nodes.name`                |
| **package address**   | The 32-byte on-chain address assigned to the package when it was published. Immutable once set.                                                                                     | `packages.nodes.address`                           |
| **struct type**       | A Move struct declared inside one of the package's modules, addressed as `<pkg>::<module>::<Struct>`. Baked into the package binary.                                                | Used as the `type` filter in an `objects` query    |
| **Move-object field** | A named field on a live Move **object** of a given struct type. Set by the contract at object-creation time, not by us.                                                             | `objects.nodes.asMoveObject.contents.json.<field>` |

"Package" vs "module" vs "object" quick sanity check: a developer deploys a **package** (gets an address), the package contains multiple **modules** (each with a hand-chosen identifier baked in), and at runtime those modules create **objects** whose **fields** can be sampled. A rule like `tradeport_biddings` targets a *module name*. A rule like `0xf5e4…a90f` targets a *package address*. A rule like `nft::NFT with tag=salus` targets a *struct type* plus a *Move-object field value*.

### Why pairs (or sets) of module names?

When a cell lists multiple modules — e.g. `farm` + `irt`, or `consumed_vaas` + `cursor` — it does **not** mean "two packages, one per name". It means **one package whose module set contains all the listed names simultaneously**. A single Move package is compiled from a collection of `.move` files, each a module; at publish time the chain receives the whole bundle under one address. `farm` and `irt` are "linked" because the Pools team put them in the same package; `consumed_vaas` and `cursor` because Wormhole did. That co-residency inside one package is the fingerprint that identifies the project — no other team on IOTA mainnet has published a package containing exactly that combination. The three rule variants differ only in how strict the combination has to be:

- **`module:all`** — the package must contain every listed module (may contain more).
- **`module:any`** — at least one of the listed modules must be present.
- **`module:exact`** — the package's full module set must equal the listed set, nothing extra, nothing missing.
- **`module:minModules`** — the package must have at least N modules total (used together with `all` to add a size sanity check, e.g. Switchboard requires ≥ 10 modules so generic two-module packages don't false-match).

L2 (IOTA EVM) projects are **not** in this document — they come straight from DefiLlama's `/protocols` feed with `chains: ['IOTA EVM']`, identified purely by DefiLlama and not by any on-chain probe of ours. See `api/src/ecosystem/ecosystem.service.ts:516`.

---

## DeFi

| Display name         | On-chain match                                | Rule           | Team                                                      | Sources                                                             |
|----------------------|-----------------------------------------------|----------------|-----------------------------------------------------------|---------------------------------------------------------------------|
| **Pools Finance**    | modules: `amm_config`, `amm_router`           | `module:all`   | Pools Finance                                             | [App](https://pools.finance)                                        |
| **Pools Farming**    | modules: `farm`, `irt`                        | `module:all`   | Pools Finance *(dedicated farming deployer, same team)*   | [App](https://pools.finance)                                        |
| **Virtue**           | modules: `liquidity_pool`, `delegates`        | `module:all`   | Virtue Money                                              | [App](https://virtue.money) · [Docs](https://docs.virtue.money)     |
| **Virtue Stability** | modules: `stability_pool`, `borrow_incentive` | `module:all`   | Virtue Money                                              | [App](https://virtue.money)                                         |
| **Virtue Pool**      | modules: `balance_number`, `stability_pool`   | `module:all`   | Virtue Money *(dedicated accounting deployer, same team)* | [App](https://virtue.money)                                         |
| **Swirl**            | modules (exact set): `pool`, `riota`          | `module:exact` | Swirl                                                     | [App](https://swirlstake.com) · [Docs](https://docs.swirlstake.com) |
| **Swirl Validator**  | modules: `cert`, `native_pool`, `validator`   | `module:all`   | Swirl                                                     | [App](https://swirlstake.com)                                       |

*Def files: `api/src/ecosystem/projects/defi/{pools-finance,swirl,virtue}.ts` · Team files: `api/src/ecosystem/teams/defi/{pools-finance,swirl,virtue}.ts`*

## Bridges

| Display name      | On-chain match                                                   | Rule                             | Team                                                                    | Sources                              |
|-------------------|------------------------------------------------------------------|----------------------------------|-------------------------------------------------------------------------|--------------------------------------|
| **iBTC Bridge**   | modules: `ibtc`, `bridge`                                        | `module:all`                     | iBTC                                                                    | —                                    |
| **LayerZero**     | module (either): `endpoint_quote` or `lz_compose`                | `module:any`                     | LayerZero                                                               | [Website](https://layerzero.network) |
| **LayerZero OFT** | modules: `oft`, `oft_impl` (split per distinct deployer address) | `module:all` + `splitByDeployer` | *(no team — aggregate bucket; team-routed per deployer where possible)* | [Website](https://layerzero.network) |
| **Wormhole**      | modules: `consumed_vaas`, `cursor`                               | `module:all`                     | Wormhole Foundation                                                     | [Website](https://wormhole.com)      |

*Def files: `api/src/ecosystem/projects/bridges/{ibtc-bridge,layerzero,wormhole}.ts` · Team files: `api/src/ecosystem/teams/bridges/{ibtc,layerzero,wormhole-foundation}.ts`*

> Why is **LayerZero OFT** `teamId: null` instead of routed to the LayerZero team? The OFT (Omnichain Fungible Token) standard is a **contract pattern** issued by many unrelated teams — every project that wants to make its token cross-chain deploys its own OFT package. The bucket is intentionally aggregate, with `splitByDeployer: true` so each deployer becomes its own sub-project. Where a sub-project's deployer is a known team (e.g. Virtue publishes a wOFT), team-deployer routing attributes the sub-project to that team; otherwise it stays in the bucket.

## Oracles

| Display name           | On-chain match                                                                   | Rule                               | Team                                                  | Sources                                                                                                                                 |
|------------------------|----------------------------------------------------------------------------------|------------------------------------|-------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| **Pyth Oracle**        | module: `batch_price_attestation`                                                | `module:all`                       | Wormhole Foundation *(shared deployer with Wormhole)* | [Website](https://pyth.network) · [Pyth IOTA docs](https://docs.pyth.network/price-feeds/core/use-real-time-data/pull-integration/iota) |
| **Switchboard Oracle** | modules: `aggregator`, `aggregator_init_action` + package has ≥ 10 modules total | `module:all` + `module:minModules` | Switchboard                                           | [Website](https://switchboard.xyz)                                                                                                      |

*Def files: `api/src/ecosystem/projects/oracles/{pyth,switchboard}.ts` · Team files: `api/src/ecosystem/teams/oracles/switchboard.ts` (Pyth shares `wormhole-foundation`)*

## NFT

| Display name        | On-chain match                                                             | Rule                               | Team                           | Sources                          |
|---------------------|----------------------------------------------------------------------------|------------------------------------|--------------------------------|----------------------------------|
| **Tradeport**       | module: `tradeport_biddings`                                               | `module:all`                       | Tradeport                      | [Website](https://tradeport.xyz) |
| **NFT Launchpad**   | modules: `launchpad`, `mint_box`                                           | `module:all`                       | Tradeport *(shared deployer)*  | [Website](https://tradeport.xyz) |
| **NFT Collections** | module (exact set, single module): `nft` (then split per deployer address) | `module:exact` + `splitByDeployer` | *(no team — aggregate bucket)* | —                                |

Sub-project names inside the **NFT Collections** bucket are constructed at runtime as `NFT Collections: <sampled-tag> (<deployer-hash>)` where `sampled-tag` comes from a Move object's `tag`/`name`/`collection_name` field (on-chain probe — `api/src/ecosystem/ecosystem.service.ts:344`). If no tag is found, the display name falls back to `NFT Collections (deployer-<hash>)`.

*Def files: `api/src/ecosystem/projects/nft/{tradeport,nft-launchpad,nft-collections}.ts` · Team files: `api/src/ecosystem/teams/nft/tradeport.ts`*

## Games

| Display name    | On-chain match                           | Rule         | Team                 | Sources |
|-----------------|------------------------------------------|--------------|----------------------|---------|
| **Chess**       | module: `chess`                          | `module:all` | Studio 0xb8b1380e    | —       |
| **Tic Tac Toe** | module: `tic_tac_iota`                   | `module:all` | Studio 0xb8b1380e    | —       |
| **2048 Game**   | modules: `campaign_rewards`, `game_2048` | `module:all` | Studio 0xb8b1380e    | —       |
| **Gambling**    | modules: `iota_flip`, `roulette`         | `module:all` | IOTA Flip / Roulette | —       |

*Def files: `api/src/ecosystem/projects/games/*.ts` · Team files: `api/src/ecosystem/teams/games/gambling.ts`, `api/src/ecosystem/teams/misc/studios.ts`*

## Trade / Supply Chain

| Display name       | On-chain match                                                                                                                                                                                                                                          | Rule                      | Team                   | Sources                                                                                      |
|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|------------------------|----------------------------------------------------------------------------------------------|
| **Salus Platform** | **package address** `0xf5e4f55993ef59fe3b61da5e054ea2a060cd78e34ca47506486ac8a7c9c7a90f`; plus a **fingerprint** on Move objects of **struct type** `<pkg>::nft::NFT` whose **Move-object fields** satisfy `issuer == 0x4876…4225` and `tag == "salus"` | `address` + `fingerprint` | Salus Platform         | [Platform](https://salusplatform.com) · [Beta Nexus](https://nexus-beta.salusplatform.com)   |
| **TLIP (Trade)**   | **package address** `0xdeadee97bb146c273e9cc55ec26c1d2936133119acc1b2fc0b542e279007e108`, and the package also contains a **module** named `ebl`                                                                                                        | `address` + `module:all`  | IOTA Foundation (TLIP) | [Website](https://tlip.io) · [IOTA Foundation — Trade](https://www.iota.org/solutions/trade) |
| **Notarization**   | module: `dynamic_notarization`                                                                                                                                                                                                                          | `module:all`              | IOTA Foundation        | [IOTA Foundation](https://www.iota.org)                                                      |
| **Traceability**   | module: `traceability`                                                                                                                                                                                                                                  | `module:all`              | IOTA Foundation        | [IOTA Foundation](https://www.iota.org)                                                      |

*Def files: `api/src/ecosystem/projects/trade/*.ts` · Team files: `api/src/ecosystem/teams/trade/{if-tlip,salus}.ts`, `api/src/ecosystem/teams/misc/iota-foundation.ts`*

## Identity

| Display name        | On-chain match                                          | Rule           | Team            | Sources                                 |
|---------------------|---------------------------------------------------------|----------------|-----------------|-----------------------------------------|
| **Identity (full)** | modules: `wot_identity`, `file_vault`, `mailbox`        | `module:all`   | IOTA Foundation | [IOTA Foundation](https://www.iota.org) |
| **Identity (WoT)**  | modules: `wot_identity`, `wot_trust`                    | `module:all`   | IOTA Foundation | [IOTA Foundation](https://www.iota.org) |
| **Credentials**     | modules (exact set): `credentials`, `identity`, `trust` | `module:exact` | IOTA Foundation | [IOTA Foundation](https://www.iota.org) |
| **OID Identity**    | modules: `oid_credit`, `oid_identity`                   | `module:all`   | OID Identity    | —                                       |

*Def files: `api/src/ecosystem/projects/identity/*.ts` · Team files: `api/src/ecosystem/teams/identity/oid.ts`, `api/src/ecosystem/teams/misc/iota-foundation.ts`*

## Chain primitives (IOTA Foundation system packages)

| Display name       | On-chain match                                                                           | Rule      | Team            | Sources                                 |
|--------------------|------------------------------------------------------------------------------------------|-----------|-----------------|-----------------------------------------|
| **IOTA Framework** | **package address** `0x0000000000000000000000000000000000000000000000000000000000000002` | `address` | IOTA Foundation | [IOTA Foundation](https://www.iota.org) |
| **Native Staking** | **package address** `0x0000000000000000000000000000000000000000000000000000000000000003` | `address` | IOTA Foundation | [IOTA Foundation](https://www.iota.org) |

*Def files: `api/src/ecosystem/projects/misc/{iota-framework,native-staking}.ts` · Team file: `api/src/ecosystem/teams/misc/iota-foundation.ts`*

## Miscellaneous

| Display name                  | On-chain match                                                                                                                                                                                        | Rule                    | Team                      | Sources                                 |
|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|---------------------------|-----------------------------------------|
| **Bolt Protocol**             | modules: `bolt`, `station`                                                                                                                                                                            | `module:all`            | Bolt Protocol             | —                                       |
| **Easy Publish**              | module: `easy_publish`                                                                                                                                                                                | `module:all`            | Easy Publish              | —                                       |
| **Gift Drop**                 | module: `giftdrop_iota`                                                                                                                                                                               | `module:all`            | Studio 0xb8b1380e         | —                                       |
| **Points System**             | modules (exact set): `constant`, `event`, `point`, `profile`                                                                                                                                          | `module:exact`          | Points System             | —                                       |
| **Staking**                   | modules: `stake`, `stake_config`                                                                                                                                                                      | `module:all`            | Staking (generic)         | —                                       |
| **Token Sale**                | module (either): `spec_sale_multicoin` or `spec_sale_v2`                                                                                                                                              | `module:any`            | Studio 0x0a0d4c9a         | —                                       |
| **Vault**                     | module (exact set, single module): `vault`                                                                                                                                                            | `module:exact`          | Studio 0xb8b1380e         | —                                       |
| **Marketplace Escrow**        | modules: `dispute_quorum`, `escrow`                                                                                                                                                                   | `module:all`            | Studio 0x0a0d4c9a         | —                                       |
| **IOTA Foundation (Testing)** | no on-chain match rule; reached exclusively via **deployer-address routing** out of the NFT Collections bucket (the deployer address is looked up against `teams/misc/if-testing.ts` known deployers) | `team-deployer-routing` | IOTA Foundation (Testing) | [IOTA Foundation](https://www.iota.org) |

*Def files: `api/src/ecosystem/projects/misc/*.ts` · Team files: `api/src/ecosystem/teams/misc/*.ts`*

---

## Teams

Each team encapsulates (a) the public-facing identity (`name`, `urls`, `description`, `logo`) and (b) a list of **known mainnet deployer addresses**. The deployer list is both an attribution aid and an anomaly signal — any mainnet deployer we see for a matched project that is **not** in this list is flagged as `anomalousDeployers` in the snapshot (worth investigating, usually either a new address we should add or a mis-attribution).

| Team name                 | Team ID               | Known deployers                                                                                                                                                                                                                                | Team def file                          | Sources                                                                                    |
|---------------------------|-----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|--------------------------------------------------------------------------------------------|
| Pools Finance             | `pools-finance`       | `0x519e…800c`, `0xeada…88e7`, `0x2130…3542` *(last one is the farming-only deployer)*                                                                                                                                                          | `teams/defi/pools-finance.ts`          | [Website](https://pools.finance)                                                           |
| Swirl                     | `swirl`               | `0x043b…351c`                                                                                                                                                                                                                                  | `teams/defi/swirl.ts`                  | *(uses project sources)*                                                                   |
| Virtue Money              | `virtue`              | `0x14ef…c3e0`, `0xf67d…5a12` *(last one is the balance/accounting-only deployer)*                                                                                                                                                              | `teams/defi/virtue.ts`                 | [App](https://virtue.money) · [Docs](https://docs.virtue.money)                            |
| iBTC                      | `ibtc`                | `0x95ec…281e`                                                                                                                                                                                                                                  | `teams/bridges/ibtc.ts`                | —                                                                                          |
| LayerZero                 | `layerzero`           | `0x8a81…d30a`                                                                                                                                                                                                                                  | `teams/bridges/layerzero.ts`           | [Website](https://layerzero.network)                                                       |
| Wormhole Foundation       | `wormhole-foundation` | `0x610a…6d27` *(shared by Wormhole core and Pyth price-feed integration)*                                                                                                                                                                      | `teams/bridges/wormhole-foundation.ts` | [Wormhole](https://wormhole.com) · [Pyth](https://pyth.network)                            |
| Switchboard               | `switchboard`         | `0x55f1…7404`                                                                                                                                                                                                                                  | `teams/oracles/switchboard.ts`         | [Website](https://switchboard.xyz)                                                         |
| Tradeport                 | `tradeport`           | `0x20d6…85f7`, `0xae24…bf1e`                                                                                                                                                                                                                   | `teams/nft/tradeport.ts`               | [Website](https://tradeport.xyz)                                                           |
| Salus Platform            | `salus`               | `0x4876…4225`                                                                                                                                                                                                                                  | `teams/trade/salus.ts`                 | [Platform](https://salusplatform.com) · [Beta Nexus](https://nexus-beta.salusplatform.com) |
| IOTA Foundation           | `iota-foundation`     | Identity: `0x4574…408f`; Notarization: `0x56af…6c8f`, `0xedb0…5fc2`; Traceability: `0x4636…b3f5`, `0x8009…a639`, `0xd604…5bbe`. Chain primitives (system packages `0x0…0002` / `0x0…0003`) have no conventional deployer — matched by address. | `teams/misc/iota-foundation.ts`        | [IOTA Foundation](https://www.iota.org)                                                    |
| IOTA Foundation (TLIP)    | `if-tlip`             | `0xd7e2…5176`                                                                                                                                                                                                                                  | `teams/trade/if-tlip.ts`               | [TLIP](https://tlip.io)                                                                    |
| IOTA Foundation (Testing) | `if-testing`          | `0xb839…5521`, `0x278f…afeb`, `0x1646…9abe` *(kept as a separate single-project team so NFT-Collections bucket sub-projects route to it via deployer)*                                                                                         | `teams/misc/if-testing.ts`             | [IOTA Foundation](https://www.iota.org)                                                    |
| OID Identity              | `oid`                 | `0x59da…cc43`, `0xbca7…b596`                                                                                                                                                                                                                   | `teams/identity/oid.ts`                | —                                                                                          |
| Bolt Protocol             | `bolt-protocol`       | `0x1d4e…6da3`                                                                                                                                                                                                                                  | `teams/misc/bolt-protocol.ts`          | —                                                                                          |
| Easy Publish              | `easy-publish`        | `0x0dce…db97`                                                                                                                                                                                                                                  | `teams/misc/easy-publish.ts`           | —                                                                                          |
| Points System             | `points-system`       | `0xd6a5…34ee`                                                                                                                                                                                                                                  | `teams/misc/points-system.ts`          | —                                                                                          |
| Staking (generic)         | `staking-generic`     | `0x9bd8…9841`                                                                                                                                                                                                                                  | `teams/misc/staking-generic.ts`        | —                                                                                          |
| IOTA Flip / Roulette      | `gambling`            | `0xbe95…6654`                                                                                                                                                                                                                                  | `teams/games/gambling.ts`              | —                                                                                          |
| Studio 0xb8b1380e         | `studio-b8b1`         | `0xb8b1…06c6`                                                                                                                                                                                                                                  | `teams/misc/studios.ts`                | *(anonymous)*                                                                              |
| Studio 0x0a0d4c9a         | `studio-0a0d`         | `0x0a0d…2140`                                                                                                                                                                                                                                  | `teams/misc/studios.ts`                | *(anonymous)*                                                                              |

---

## Provenance summary

| Source of the displayed string                                              | Who wrote it                                                         | Where to find it                                                                           |
|-----------------------------------------------------------------------------|----------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| **Project display name** (e.g. "Virtue", "Tradeport")                       | Us, in a `ProjectDefinition.name` field                              | `api/src/ecosystem/projects/**/*.ts`                                                       |
| **Team display name** (e.g. "Virtue Money", "Tradeport")                    | Us, in a `Team.name` field                                           | `api/src/ecosystem/teams/**/*.ts`                                                          |
| **On-chain match tokens** (`stability_pool`, `vault`, `tradeport_biddings`) | The project, at compile time — baked into the published Move package | Read via `packages.nodes.modules.nodes.name` from `graphql.mainnet.iota.cafe`              |
| **Package addresses**                                                       | IOTA RPC — assigned at publish time                                  | `packages.nodes.address`                                                                   |
| **Deployer addresses**                                                      | IOTA RPC — sender of the publish transaction                         | `packages.nodes.previousTransactionBlock.sender.address`                                   |
| **NFT collection labels** (inside the NFT Collections bucket)               | The minter's contract — written into Move object fields at mint time | Move object fields `tag` / `name` / `collection_name` (read in `ecosystem.service.ts:344`) |
| **L2 project name** (MagicSea, Deepr Finance, …)                            | DefiLlama — from their curated `/protocols` feed                     | `https://api.llama.fi/protocols`, filtered to `chains: ['IOTA EVM']`                       |
