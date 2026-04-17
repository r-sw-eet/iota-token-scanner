import { Team } from '../team.interface';

export const wormholeFoundation: Team = {
  id: 'wormhole-foundation',
  name: 'Wormhole Foundation',
  description: 'Wormhole cross-chain messaging + the Pyth price-feed integration on IOTA (shared deployer).',
  urls: [
    { label: 'Wormhole', href: 'https://wormhole.com' },
    { label: 'Pyth', href: 'https://pyth.network' },
  ],
  deployers: ['0x610a7c8f0e7cb73d3c93d1b4919de1b76fc30a8efa8e967ccdbb1f7862ee6d27'],
  logo: '/logos/wormhole.ico',
  attribution: `
One deployer that publishes both the Wormhole core messaging contract (modules \`consumed_vaas\` + \`cursor\`) and Pyth Network's \`batch_price_attestation\` package. That's expected — Pyth prices ride Wormhole's messaging layer, and the Wormhole Foundation operates both on IOTA. The shared deployer is documented in Pyth's IOTA integration docs (docs.pyth.network).
`.trim(),
};
