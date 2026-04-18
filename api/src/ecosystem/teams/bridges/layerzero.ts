import { Team } from '../team.interface';

export const layerzero: Team = {
  id: 'layerzero',
  name: 'LayerZero',
  description: 'LayerZero V2 omnichain interoperability protocol on IOTA Rebased. Operates the IOTA L1 Move deployment (eid 30423) — EndpointV2, ULN302 message library, DVN/Executor workers, ZRO token, PTB-builder infrastructure, and OApp framework. 22 packages at the single team deployer.',
  urls: [
    { label: 'Website', href: 'https://layerzero.network' },
    { label: 'IOTA L1 docs', href: 'https://docs.layerzero.network/v2/deployments/chains/iota-l1' },
    { label: 'Deployments API', href: 'https://metadata.layerzero-api.com/v1/metadata/deployments' },
  ],
  deployers: ['0x8a81a6096a81fe2b722541bc19eb30e6c025732638375c362f07ea48979fd30a'],
  logo: '/logos/layerzero.png',
  attribution: `
Gold-standard attestation via LayerZero's own metadata API (\`metadata.layerzero-api.com/v1/metadata/deployments\`), which publishes IOTA L1 under chainKey \`iotal1-mainnet\`:

\`\`\`json
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
\`\`\`

Plus the human-readable chain page at \`docs.layerzero.network/v2/deployments/chains/iota-l1\` (eid 30423, explicitly describing IOTA L1 as a Move-based deployment "separate from IOTA EVM L2, EID 30284"), and the IOTA-L1 developer overview at \`docs.layerzero.network/v2/developers/iota/overview\`.

On-chain: deployer \`0x8a81a6096a81fe2b722541bc19eb30e6c025732638375c362f07ea48979fd30a\` publishes 22 packages, all LayerZero V2 components:

- **endpointV2** \`0xb8e0cd76cb8916c48c03320e43d46c3775edd6f17ce7fbfad6c751289dcb1735\` — 18 modules: \`endpoint_quote, endpoint_send, endpoint_v2, lz_compose, lz_receive, message_lib_manager, message_lib_quote, message_lib_send, message_lib_set_config, message_lib_type, messaging_channel, messaging_composer, messaging_fee, messaging_receipt, oapp_registry, outbound_packet, timeout, utils\`. Exact match to the API.
- **sendUln302 / receiveUln302** \`0x042e3bb837e5528e495124542495b9df5016acd011d89838ae529db5a814499e\` — modules \`executor_config, oapp_uln_config, receive_uln, send_uln, uln_302, uln_config\`. Exact match.
- **ZRO token** (\`zro\` module): \`0xed5b4c39309e0af02a84c27a23ecd3f0d8dc825b2297c2b2e23bfeeac4f05698\`.
- **Call pattern primitives** (LayerZero's Move-specific IPC): \`call\`, \`call_cap\`, \`multi_call\`, \`argument\`, \`function\`, \`move_call\`, \`move_calls_builder\`.
- **Workers / DVN / Executor infra:** \`dvn_assign_job\`, \`dvn_get_fee\`, \`dvn_verify\`, \`executor_assign_job\`, \`executor_get_fee\`, \`worker_registry\`, \`worker_common\`, \`worker_info_v1\`, \`fee_recipient\`, \`packet_v1_codec\`, \`worker_options\`.
- **Message libraries:** \`simple_message_lib\`, \`blocked_message_lib\`.
- **PTB builders** (for LayerZero's Programmable Transaction Block construction on Move): \`endpoint_ptb_builder\`, \`uln_302_ptb_builder\`, \`simple_msglib_ptb_builder\`, \`blocked_msglib_ptb_builder\`, \`set_worker_ptb\`, \`msglib_ptb_builder_info\`.
- **OApp framework:** \`endpoint_calls\`, \`enforced_options\`, \`oapp\`, \`oapp_info_v1\`, \`oapp_peer\`, \`ptb_builder_helper\`.
- **View packages:** \`endpoint_views\`, \`uln_302_views\`.
- **Utilities:** \`buffer_reader, buffer_writer, bytes32, hash, package, table_ext\`, \`estimate_fee\`, \`package_whitelist_validator\`.

The executor address \`0x29b691f9496eea6df8f4d77ceacee5949e92e7e51b2e3c2e6cd70eef5237e99a\` is an operational account, not a package deployer (confirmed via \`packages(…)\` query: zero packages at that address). Consistent with LayerZero's architecture where the Executor is an off-chain worker identity.

Triangulation:
- [x] LayerZero's own metadata API names \`iotal1-mainnet\` with eid 30423, chainLayer L1, chainType iotamove.
- [x] The API publishes 3 addressable components (endpointV2 + sendUln302/receiveUln302 pointing at the same ULN package + executor as an account).
- [x] On-chain scan confirms 2 of the 3 API-published addresses are at deployer \`0x8a81a6096a81fe2b722541bc19eb30e6c025732638375c362f07ea48979fd30a\`; the 3rd is an account (non-package).
- [x] 22 packages total, all LayerZero V2 components with matching module names.
- [x] Zero off-topic packages; no LayerZero-adjacent modules (\`messagelib\`, \`endpoint\`, \`lz_compose\`) appear at any other deployer on IOTA mainnet.

LayerZero OFT tokens are NOT routed to this team — they're deployed by third parties (e.g. Virtue) and live in the \`layerZeroOft\` aggregate bucket instead.
`.trim(),
};
