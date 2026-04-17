import { ProjectDefinition } from '../project.interface';

export const pythOracle: ProjectDefinition = {
  name: 'Pyth Oracle',
  layer: 'L1',
  category: 'Oracle',
  description: 'Pyth Network price feeds integrated natively into IOTA Rebased. Provides real-time price data for 500+ assets (crypto, commodities, equities, forex) with sub-second update frequency. Used by Deepr Finance, Virtue, and CyberPerp.',
  urls: [
    { label: 'Website', href: 'https://pyth.network' },
    { label: 'IOTA Docs', href: 'https://docs.pyth.network/price-feeds/core/use-real-time-data/pull-integration/iota' },
  ],
  teamId: 'wormhole-foundation',
  logo: '/logos/pyth.png',
  match: { all: ['batch_price_attestation'] },
  attribution: `
On-chain evidence: Move package with module \`batch_price_attestation\`.

Pyth Network's on-chain price-feed contracts use VAAs (Wormhole-delivered) carrying batched price updates. \`batch_price_attestation\` is the literal Pyth module name (see Pyth's IOTA integration docs at docs.pyth.network). The deployer is shared with Wormhole because Pyth prices ride Wormhole's messaging layer — the Wormhole Foundation operates both on IOTA.
`.trim(),
};
