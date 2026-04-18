import { Team } from '../team.interface';

export const tradeport: Team = {
  id: 'tradeport',
  name: 'Tradeport',
  description: 'Multi-chain NFT marketplace with a comprehensive stack: bidding, listings, kiosk-based trades, transfer-policy rules, and NFT Launchpad. IOTA is a supported chain alongside Aptos and others.',
  urls: [
    { label: 'Website', href: 'https://tradeport.xyz' },
    { label: 'IOTA launch blog', href: 'https://www.tradeport.xyz/blog/tradeport-now-supports-iota-a-new-era-for-onchain-innovation' },
  ],
  deployers: [
    '0x20d666d8e759b3c0c3a094c2bac81794e437775c7e4d3d6fe33761ae063385f7',
    '0xae24ce73cd653c8199bc24afddc0c4ddbf0e9901d504c3b41066a6a396e8bf1e',
  ],
  logo: '/logos/tradeport.svg',
  attribution: `
Organizational-grade attestation:

- **Tradeport's own blog** announces the IOTA integration: \`tradeport.xyz/blog/tradeport-now-supports-iota-a-new-era-for-onchain-innovation\`.
- **Cross-chain consistency with Aptos**: Aptos docs reference Tradeport's Aptos deployment at \`aptos.dev/build/indexer/nft-aggregator/marketplaces/tradeport\` with the same product architecture (V1 \`biddings\`+\`listings\`, V2 \`biddings_v2\`+\`listings_v2\`). This confirms the IOTA deployment is the same team's port — same marketplace conventions, adapted to IOTA Move's native Kiosk primitive.

No single page publishes a package address directly (Tradeport's developer docs return 404, and their IOTA launch blog describes the integration without listing addresses), but the organizational signal is solid.

On-chain footprint, two closely-related deployers ship a complete multi-product NFT marketplace stack — 15 packages total:

**Deployer A** \`0x20d6…85f7\` (12 packages):
- 3 upgrade versions of \`tradeport_biddings\` (marketplace bidding primitive — brand literal).
- 3 upgrade versions of \`{launchpad, mint_box, pseudorandom, signature}\` (NFT Launchpad product — pseudorandom minting + signature-based whitelist).
- 2 versions of \`kiosk_listings\` (Kiosk-based listings).
- 2 versions of \`kiosk_transfers\` (Kiosk-based transfers).
- 2 versions of \`listings\` (plain listings — same module name as Aptos V1 Tradeport's \`listings\`).

**Deployer B** \`0xae24…bf1e\` (3 packages):
- 1 with \`{launchpad, mint_box, pseudorandom, signature}\` (same launchpad signature — deployer also ships the launchpad product).
- 1 with 6 modules: \`{floor_price_rule, kiosk_lock_rule, personal_kiosk, personal_kiosk_rule, royalty_rule, witness_rule}\` — transfer-policy rules for the Kiosk standard (royalty enforcement, floor price, personal-kiosk lock, witness-based auth).
- 1 with a single \`nft_type\` module — shared NFT type package.

Every package fits a comprehensive NFT marketplace stack. Zero off-topic deployments.

Triangulation:
- [x] Tradeport publicly announces IOTA deployment.
- [x] Aptos Tradeport uses the same biddings/listings architecture — confirms same team behind both deployments.
- [x] Module name \`tradeport_biddings\` is literally the organization's brand baked into the identifier.
- [x] On-chain scan shows exactly two closely-related deployers covering marketplace bidding + listings + kiosk integration + launchpad + transfer-policy rules — a complete stack.
- [x] No other IOTA mainnet deployer ships \`tradeport_biddings\`, \`launchpad+mint_box\`, or the multi-module kiosk transfer-policy rule package.
`.trim(),
};
