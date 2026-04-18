# Thread — LayerZero registry undercount

## Goal

Registry currently matches **1 of 22** LayerZero packages. The rule
`{any: ['endpoint_quote', 'lz_compose']}` only picks up the 18-module
EndpointV2 core. The other 21 packages (ZRO, ULN302, DVN/Executor workers,
PTB builders, OApp framework, message libraries, views, utilities) ship
at the same deployer `0x8a81a6096a81fe2b722541bc19eb30e6c025732638375c362f07ea48979fd30a`
but fall through our filter. Decide on and draft the fix.

## On-chain package inventory — re-verified 2026-04-17

Source: full mainnet sweep of `packages(first: 50, after: …)` via
`https://graphql.mainnet.iota.cafe/graphql`. Total mainnet packages:
**747**. Filtered to `previousTransactionBlock.sender.address ==
0x8a81a6…d30a`: **22 packages**. Matches the handoff count exactly —
nothing has changed.

| #   | Address                                                              | Modules                                                                                                                                                                                                                                                                                                             |
|-----|----------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1   | `0xb8e0cd76cb8916c48c03320e43d46c3775edd6f17ce7fbfad6c751289dcb1735` | `endpoint_quote, endpoint_send, endpoint_v2, lz_compose, lz_receive, message_lib_manager, message_lib_quote, message_lib_send, message_lib_set_config, message_lib_type, messaging_channel, messaging_composer, messaging_fee, messaging_receipt, oapp_registry, outbound_packet, timeout, utils` (EndpointV2 core) |
| 2   | `0x042e3bb837e5528e495124542495b9df5016acd011d89838ae529db5a814499e` | `executor_config, oapp_uln_config, receive_uln, send_uln, uln_302, uln_config` (ULN302 / send+receive)                                                                                                                                                                                                              |
| 3   | `0xed5b4c39fa2e3c518e0ce03a40f9a05ac37f46b770c8f158f6984c6d8bf05698` | `zro` (ZRO token)                                                                                                                                                                                                                                                                                                   |
| 4   | `0x0a8ff628914b6f968a96754c9724b5d739dd0960d83bf76f98556919bc275866` | `call, call_cap`                                                                                                                                                                                                                                                                                                    |
| 5   | `0xadce7a667051fa4bf123c82ed581bd8a85bf306edbfcc3b23f81f3ad16d11639` | `multi_call`                                                                                                                                                                                                                                                                                                        |
| 6   | `0x82f74d1641ded950ebb3d616570f25c00f2e5191784115dcb4ae6a7455608b2d` | `argument, function, move_call, move_calls_builder` (Call pattern IPC)                                                                                                                                                                                                                                              |
| 7   | `0xf6bb53dcab67a953b363bec9dbcbfefa48ab1b1efb47c87539f0f3406a54a321` | `dvn_assign_job, dvn_get_fee, dvn_verify, executor_assign_job, executor_get_fee` (DVN + Executor workers)                                                                                                                                                                                                           |
| 8   | `0xc3bcb65a09f2c113af3665396d2020f1736fd4d2c0bef92051956eec1b8dd14d` | `worker_registry`                                                                                                                                                                                                                                                                                                   |
| 9   | `0xd33a7a231aebbf1b3d82705e0c7a68d9a9b36edf9235062eafce909e58f33bac` | `worker_common, worker_info_v1`                                                                                                                                                                                                                                                                                     |
| 10  | `0x82e5f11a334d63630cdc992988900c34d571cf0ebb395db0ec5492298978003f` | `fee_recipient, packet_v1_codec, worker_options`                                                                                                                                                                                                                                                                    |
| 11  | `0xa17119a55db88904f1dc17ebc506ee080be6eb309ec72f3fe33451c493b0a83f` | `estimate_fee`                                                                                                                                                                                                                                                                                                      |
| 12  | `0xecf3d32cc8bbb4b3069825fc11310e535efb40738c9b6cf3e12eabd08b9eecdb` | `simple_message_lib`                                                                                                                                                                                                                                                                                                |
| 13  | `0x29fa6fd23683c0e04875b200e0ccfddb7d210c3b60572746e1e1be93d05fdc7f` | `blocked_message_lib`                                                                                                                                                                                                                                                                                               |
| 14  | `0x5d194608ce6b7dd7ff95c6f232aad6dc5955814366951792cfd10da506743fa1` | `endpoint_ptb_builder, msglib_ptb_builder_info`                                                                                                                                                                                                                                                                     |
| 15  | `0x612a2eddcf0b06b5daeb0ebabaabf8c47732305cfe3be7103b1ea5d4fd5571e1` | `simple_msglib_ptb_builder`                                                                                                                                                                                                                                                                                         |
| 16  | `0x4a96f58ba85d69fbaa759fdcd0cc2c1db8d309c4d3f4aa1f3aa9c139ccdfcba6` | `blocked_msglib_ptb_builder`                                                                                                                                                                                                                                                                                        |
| 17  | `0x2791eb9c498c5f6f39d4480743dbb86164deda1055c1606f22b53c58d4ebde20` | `uln_302_ptb_builder`                                                                                                                                                                                                                                                                                               |
| 18  | `0xebd01b739a4c7d2dde62c58c2f0966150c5bb34a917fc923903a8cc9bbc55891` | `set_worker_ptb`                                                                                                                                                                                                                                                                                                    |
| 19  | `0x2b14fe07b7f84736d91fbe596ba3f6fe5a9ee2db738dc986a8a64c81ef188937` | `endpoint_calls, enforced_options, oapp, oapp_info_v1, oapp_peer, ptb_builder_helper` (OApp framework)                                                                                                                                                                                                              |
| 20  | `0xa6e21c41a5db94c69827dbb1e32fd4d99c3416357fd93df5ea9449b9f7f16662` | `endpoint_views, uln_302_views` (view packages)                                                                                                                                                                                                                                                                     |
| 21  | `0x4237925ef818b257654a34d1fdd6347fcab007a2cb2b2d5e63235e45e79b74e0` | `package_whitelist_validator`                                                                                                                                                                                                                                                                                       |
| 22  | `0x56a262afe5db9b34426f343160481290d010551ca15b427b1fb4b0010e3b69ed` | `buffer_reader, buffer_writer, bytes32, hash, package, table_ext` (utility primitives)                                                                                                                                                                                                                              |

### Module-name collision analysis (important for rule design)

Of the 63 distinct module names across those 22 packages, only three
(`hash`, `utils`, `bytes32`) also appear at non-LayerZero deployers
anywhere on mainnet. All other 60 module names are **exclusive to the
LayerZero deployer**. That makes a broad `any:` match viable with zero
false positives, provided we exclude the three generic names.

Notable confirms:

- `oft` appears at zero packages under the LZ deployer — broadening the
  match will not steal from the `layerZeroOft` aggregate bucket.
- `buffer_reader`, `buffer_writer`, `table_ext` appear at exactly one
  mainnet package each, all at the LZ deployer. Any of them safely
  catches the primitives-only package (row 22).

## Recommendation — Option 3 (broader module match), one umbrella row

**Use option 3, not 1, 2, or 4.** Rationale:

- **Option 1 (hardcoded addresses)** — works today, but brittle. Every
  LayerZero upgrade or newly-published support package silently drops
  off the row until someone updates the registry. The user pointed out
  in the handoff that this is fragile; on IOTA L1 Move, package upgrades
  publish a new on-chain address rather than mutating in place, so a
  new address *will* appear, and the registry won't auto-pick it up.
- **Option 2 (deployer-match rule type)** — best long-term solution,
  but requires a scanner-engine extension (new `deployerAddresses`
  rule in `ProjectDefinition.match`, plumbing in
  `ecosystem.service.ts`'s package classification loop, new unit +
  functional tests). Not a LayerZero-specific change. Keep this as a
  tracked infrastructure item — it would also close the Tradeport and
  ObjectID undercount threads — but ship option 3 first.
- **Option 4 (split into sub-projects)** — too granular for the public
  dashboard. The user-facing signal is "how much activity does
  LayerZero process on IOTA" — splitting into Endpoint / ULN / ZRO /
  Workers / OApp / Views / Utilities adds 5-7 rows that mean nothing
  to a non-protocol engineer. LayerZero itself presents the V2 stack
  as a single product. Keep it as one row.
- **Option 3 (broader module match)** — exploits the fact that the 63
  module names at this deployer are essentially a LayerZero-V2-on-Move
  glossary. A curated `any:` list is explicit, reviewable, and
  self-documenting (each name tells you which LZ component it catches).
  With the collision analysis above we know it catches 22/22 with
  zero false positives on today's mainnet.

### One row, not many

Keep a single `LayerZero` project row. The EndpointV2 core, ULN libraries,
DVN/Executor workers, OApp framework, ZRO token, and utilities are all
one protocol to end users. Summed activity is the meaningful signal;
per-component breakdown is a protocol-engineering concern that belongs
in docs, not in a public dashboard row. (Same argument as why we don't
split Wormhole into VAA parser + core messaging + Pyth price feed —
those live as separate rows only because Pyth is a genuinely distinct
oracle product.)

## Draft TS — ready to paste into `api/src/ecosystem/projects/bridges/layerzero.ts`

Replace the existing `layerZero` export. Leave `layerZeroOft` untouched.

```ts
import { ProjectDefinition } from '../project.interface';

export const layerZero: ProjectDefinition = {
  name: 'LayerZero',
  layer: 'L1',
  category: 'Bridge',
  description: 'LayerZero omnichain interoperability protocol on IOTA Rebased. Enables cross-chain messaging and asset transfers between IOTA and 150+ connected blockchains via a decentralized messaging layer.',
  urls: [
    { label: 'Website', href: 'https://layerzero.network' },
    { label: 'IOTA Docs', href: 'https://docs.layerzero.network/v2/developers/iota/overview' },
  ],
  teamId: 'layerzero',
  // Broad module match covering all 22 LayerZero V2 components published
  // at deployer 0x8a81…d30a: EndpointV2 core, ULN302 send/receive, ZRO
  // token, DVN + Executor workers, Call-pattern IPC, message libraries,
  // PTB builders, OApp framework, view packages, and utility primitives.
  // Every listed module name is exclusive to the LayerZero deployer on
  // mainnet (verified 2026-04-17 against all 747 mainnet packages); no
  // false positives at any other deployer. Generic names like `utils`,
  // `hash`, `bytes32` deliberately excluded — they collide with other
  // protocols. `buffer_reader` included specifically to catch the
  // primitives-only package (otherwise no distinctive module name).
  match: {
    any: [
      // EndpointV2 core (row 1)
      'endpoint_quote', 'endpoint_v2', 'lz_compose', 'lz_receive',
      'messaging_channel', 'messaging_composer', 'oapp_registry',
      'outbound_packet',
      // ULN302 (row 2)
      'uln_302', 'uln_config', 'oapp_uln_config', 'receive_uln', 'send_uln',
      // ZRO token (row 3)
      'zro',
      // Call-pattern IPC (rows 4, 5, 6)
      'call_cap', 'multi_call', 'move_calls_builder',
      // DVN + Executor workers (rows 7-10)
      'dvn_verify', 'executor_config', 'worker_registry', 'worker_common',
      'packet_v1_codec',
      // Message libraries (rows 12, 13)
      'simple_message_lib', 'blocked_message_lib',
      // PTB builders (rows 14-18)
      'endpoint_ptb_builder', 'uln_302_ptb_builder',
      'simple_msglib_ptb_builder', 'blocked_msglib_ptb_builder',
      'set_worker_ptb',
      // OApp framework (row 19)
      'oapp', 'oapp_peer', 'enforced_options',
      // View packages (row 20)
      'endpoint_views', 'uln_302_views',
      // Misc workers/utilities (rows 11, 21, 22)
      'estimate_fee', 'package_whitelist_validator', 'buffer_reader',
    ],
  },
  attribution: `
On-chain evidence: Move package at deployer \`0x8a81…d30a\` whose module list overlaps LayerZero's V2-on-Move component vocabulary (EndpointV2 core, ULN302, ZRO, DVN/Executor workers, OApp framework, PTB builders, view packages, primitives).

LayerZero's own metadata API publishes \`iotal1-mainnet\` (eid 30423, chainType iotamove) at \`https://metadata.layerzero-api.com/v1/metadata/deployments\`, naming two addressable package components — EndpointV2 at \`0xb8e0cd76…dcb1735\` and ULN302 at \`0x042e3bb8…4499e\` — both deployed by \`0x8a81…d30a\`. The 20 remaining packages at the same deployer are the support infrastructure: ZRO token, DVN/Executor workers, Call-pattern primitives, PTB builders, OApp framework, views, and utilities. Module names are exclusive to this deployer on mainnet (verified via full on-chain sweep 2026-04-17). LayerZero OFT token-wrappers (deployed by third-party teams such as Virtue) are NOT routed here; they live in the \`layerZeroOft\` aggregate bucket instead.
`.trim(),
};
```

## Edge cases

### Interaction with the `layerZeroOft` bucket

Non-issue. The `layerZeroOft` rule is `{all: ['oft', 'oft_impl']}` and
there are **zero `oft` modules at the LayerZero deployer**. Third-party
OFT wrappers (Virtue, CyberPerp, etc.) continue to match the OFT bucket
(or their own team-specific rules that should come first in
`ALL_PROJECTS`), and our new broader `LayerZero` rule won't steal them.
If a team ever ships an OFT token named with one of the broad-match
words, they'd need to be listed earlier in `ALL_PROJECTS` (the
"match order is priority order" comment already governs this).

### Interaction with the CyberPerp OFT proposal (handoff-queued)

The handoff also proposes a CyberPerp OFT rule
`{all: ['oft', 'oft_impl', 'pausable', 'rate_limiter']}`. None of those
four modules appear in our broadened LayerZero `any:` list, so the two
rules are orthogonal — ordering them doesn't matter for correctness.

### Upgrade / new-package detection

If LayerZero upgrades EndpointV2, they'll publish a new package address
with the same (or a superset) module-name signature. Our module-match
rule auto-catches the new address. That's the key advantage over option
1 (hardcoded `packageAddresses`). A new LayerZero component introducing
a completely novel module name would still be missed, but that's rare
— V2 is a stable architecture.

### If LayerZero ever renames the primitives package

Only `buffer_reader` + `buffer_writer` + `table_ext` currently anchor
the primitives-only row (row 22). They're all LZ-exclusive today. If
LayerZero renames one of them, include the other two as substitutes
(we already list `buffer_reader`; `buffer_writer` and `table_ext` are
safe fallbacks). Risk is low — these are LayerZero-internal naming
conventions.

### Generic-names exclusion rationale (do not add these)

Deliberately NOT included in the `any:` list:

- `utils` — appears at 5+ non-LZ deployers (generic).
- `hash` — appears at 2 non-LZ deployers.
- `bytes32` — appears at 1 non-LZ deployer.
- `call`, `function`, `argument`, `move_call`, `package`, `timeout`,
  `fee_recipient`, `oapp_info_v1`, `oapp_uln_config`,
  `message_lib_send/manager/quote/…`, `endpoint_send`, `endpoint_calls`,
  `ptb_builder_helper`, `msglib_ptb_builder_info`, `enforced_options`,
  `worker_info_v1`, `worker_options`, `executor_get_fee`,
  `executor_assign_job`, `dvn_assign_job`, `dvn_get_fee`,
  `messaging_fee`, `messaging_receipt`, `message_lib_type`,
  `message_lib_set_config` — LZ-exclusive on mainnet today, but most
  are near-generic English words. Including them in the rule would
  invite future false positives as the IOTA ecosystem grows. The list
  above is already redundant (every one of the 22 packages is hit by
  at least one entry); adding more doesn't improve recall.

### Testing

Add a unit test asserting the LayerZero rule matches exactly the 22
known package signatures from the inventory above (use a fixture list
of `{address, modules}` tuples). The existing
`api/src/ecosystem/ecosystem.service.spec.ts` pattern covers this
— `jest` can run a table-driven test over the 22 rows.

## Not in scope for this thread

- A new `deployerAddresses` match rule type (option 2). Tracked under
  Registry-expansion and Registry-correction for Tradeport, ObjectID,
  LiquidLink — same pattern. Worth doing eventually, but independent
  of this LayerZero fix.
- Splitting LayerZero into sub-projects (option 4). Rejected above.
- Updating `project-mapping.md` — do that when the patch lands.
