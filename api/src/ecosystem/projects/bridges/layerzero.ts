import { ProjectDefinition } from '../project.interface';

export const layerZero: ProjectDefinition = {
  name: 'LayerZero',
  layer: 'L1',
  category: 'Bridge',
  description: 'LayerZero omnichain interoperability protocol on IOTA Rebased. Enables cross-chain messaging and asset transfers between IOTA and 150+ connected blockchains via a decentralized messaging layer.',
  urls: [
    { label: 'Website', href: 'https://layerzero.network' },
  ],
  teamId: 'layerzero',
  match: { any: ['endpoint_quote', 'lz_compose'] },
  attribution: `
On-chain evidence: Move package containing at least one of \`endpoint_quote\` or \`lz_compose\`.

LayerZero is a publicly-documented cross-chain messaging protocol with an official IOTA deployment. The module names \`endpoint_quote\` and \`lz_compose\` are LayerZero-specific terminology (endpoint quoting and composed messaging) documented on layerzero.network. The deployer is LayerZero's core endpoint deployer — identifiable from LayerZero's public contract listings.
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
