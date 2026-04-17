import { ProjectDefinition } from '../project.interface';

export const wormhole: ProjectDefinition = {
  name: 'Wormhole',
  layer: 'L1',
  category: 'Bridge',
  description: 'Wormhole cross-chain messaging protocol on IOTA Rebased. Provides generic message passing between IOTA and other blockchains, secured by a network of guardian nodes that verify and relay cross-chain attestations.',
  urls: [
    { label: 'Website', href: 'https://wormhole.com' },
  ],
  teamId: 'wormhole-foundation',
  match: { all: ['consumed_vaas', 'cursor'] },
  attribution: `
On-chain evidence: Move package with both \`consumed_vaas\` and \`cursor\` modules.

Wormhole's core messaging contracts use VAAs (Verifiable Action Approvals) as their cross-chain attestation primitive; \`consumed_vaas\` is Wormhole-specific terminology (tracks replay-protected VAAs that have been redeemed) and paired with \`cursor\` it's a near-unique signature on IOTA. The deployer is shared with the Pyth price-feed integration because the Wormhole Foundation maintains both (Pyth prices are delivered via Wormhole's messaging layer on IOTA).
`.trim(),
};
