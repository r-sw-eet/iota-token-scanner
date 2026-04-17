import { ProjectDefinition } from '../project.interface';

export const nftLaunchpad: ProjectDefinition = {
  name: 'NFT Launchpad',
  layer: 'L1',
  category: 'NFT',
  description: 'NFT launch platform on IOTA Rebased with mint box mechanics, pseudorandom minting for fair distribution, and signature-based whitelist verification.',
  urls: [],
  teamId: 'tradeport',
  match: { all: ['launchpad', 'mint_box'] },
  attribution: `
On-chain evidence: Move package with both \`launchpad\` and \`mint_box\` modules.

Tradeport ships a companion NFT launchpad product alongside its marketplace. \`mint_box\` is a Tradeport-specific term for their randomized mint mechanic. Attributed to the Tradeport team because the launchpad package shares deployer addresses with the main Tradeport marketplace package — same organization, second product line.
`.trim(),
};
