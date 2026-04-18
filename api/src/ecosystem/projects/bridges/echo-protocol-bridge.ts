import { ProjectDefinition } from '../project.interface';

export const echoProtocolBridge: ProjectDefinition = {
  name: 'Echo Protocol Bridge',
  layer: 'L1',
  category: 'Bridge',
  description: 'Multi-asset BTCFi bridge operated by Echo Protocol. First asset minted is iBTC; the bridge is designed to custody additional assets behind the same committee-based security model with rate limiting and a multi-sig treasury.',
  urls: [{ label: 'Website', href: 'https://www.echo-protocol.xyz' }],
  teamId: 'echo-protocol',
  match: { all: ['bridge', 'committee', 'ibtc', 'treasury'] },
  attribution: `
On-chain evidence: Move package containing \`bridge\`, \`committee\`, \`ibtc\`, and \`treasury\` modules simultaneously — a 4-module subset of Echo Protocol's 9-module package signature (\`bridge, chain_ids, committee, crypto, ibtc, limiter, message, message_types, treasury\`).

The 9-module set is the exact scope of Hacken's audit of Echo Protocol's IOTA deployment; only one mainnet deployer (\`0x95ec…281e\`) ships packages matching it, across five upgrade versions. Tightening the match to the 4-module subset keeps the rule readable without risking collisions — no other IOTA deployer uses any of the four names, let alone all four together. The row is named after the bridge operator (Echo Protocol) rather than its first asset (iBTC) because the bridge is designed to mint additional assets.
`.trim(),
};
