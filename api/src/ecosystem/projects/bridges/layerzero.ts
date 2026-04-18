import { ProjectDefinition } from '../project.interface';

export const layerZero: ProjectDefinition = {
  name: 'LayerZero',
  layer: 'L1',
  category: 'Bridge',
  description: 'LayerZero V2 omnichain interoperability protocol on IOTA Rebased. EndpointV2, ULN302 message library, DVN/Executor workers, ZRO token, and PTB-builder infrastructure — 22 packages shipped from LayerZero\'s IOTA L1 deployer.',
  urls: [
    { label: 'Website', href: 'https://layerzero.network' },
    { label: 'IOTA L1 docs', href: 'https://docs.layerzero.network/v2/deployments/chains/iota-l1' },
    { label: 'Deployments API', href: 'https://metadata.layerzero-api.com/v1/metadata/deployments' },
  ],
  teamId: 'layerzero',
  match: { deployerAddresses: ['0x8a81a6096a81fe2b722541bc19eb30e6c025732638375c362f07ea48979fd30a'] },
  attribution: `
On-chain evidence: deployer-match rule pinned to LayerZero's IOTA L1 deployer \`0x8a81a6…d30a\`. All 22 packages at this deployer are LayerZero V2 components.

Gold-standard attestation: LayerZero's own metadata API (metadata.layerzero-api.com/v1/metadata/deployments) publishes IOTA L1 under chainKey \`iotal1-mainnet\`, eid 30423, chainType \`iotamove\`, chainLayer L1. The API names specific package addresses — \`endpointV2: 0xb8e0cd76…\`, \`sendUln302 / receiveUln302: 0x042e3bb8…\`, \`executor: 0x29b691f9…\` — and 2 of the 3 are at this deployer (the executor is an operational account, not a package deployer). LayerZero's docs at docs.layerzero.network/v2/developers/iota/overview confirm the Move architecture ("Programmable Transaction Blocks and the Call pattern") that the on-chain module inventory matches exactly.

Previously matched via \`{any: [endpoint_quote, lz_compose]}\`, which only caught 1 of 22 packages (the EndpointV2 core). Switched to \`deployerAddresses\` for full coverage — catches ZRO token, ULN302, DVN/Executor workers, PTB builders, OApp framework, message libraries, views, and utilities without risking future false positives on generic module names.
`.trim(),
};

export const layerZeroOft: ProjectDefinition = {
  name: 'LayerZero OFT',
  layer: 'L1',
  category: 'Bridge (OFT)',
  description: 'LayerZero Omnichain Fungible Token standard on IOTA. Allows tokens to exist natively on multiple chains simultaneously with unified supply, enabling seamless cross-chain token transfers.',
  urls: [
    { label: 'Website', href: 'https://layerzero.network' },
  ],
  teamId: null,
  logo: '/logos/layerzero.png',
  disclaimer: "Aggregate bucket split by deployer — each sub-project represents all OFT packages published by a single address (a token-wrapper), identified by a short hash of that deployer. Known deployers (e.g., Virtue) are routed to their team via the registry.",
  splitByDeployer: true,
  match: { all: ['oft', 'oft_impl'] },
  attribution: `
On-chain evidence: Move package with both \`oft\` and \`oft_impl\` modules.

LayerZero's OFT (Omnichain Fungible Token) standard is a **contract pattern**, not a product — any team that wants to make its token cross-chain deploys its own OFT package. That's why this entry is an aggregate bucket (\`teamId: null\` + \`splitByDeployer: true\`): each deployer becomes its own sub-project. Where a sub-project's deployer is a known team (e.g. Virtue's wOFT), team-deployer routing attributes it to that team; otherwise it stays in the bucket with a deployer-hash suffix. Module names \`oft\` / \`oft_impl\` are LayerZero's canonical OFT module naming.
`.trim(),
};
