import { Team } from '../team.interface';

export const liquidlink: Team = {
  id: 'liquidlink',
  name: 'LiquidLink',
  description: 'Modular on-chain incentive infrastructure — points, profile NFTs, referrals, and social engagement. Multi-chain (IOTA + Sui mainnet) with integrations to Bucket Protocol and Strater on Sui. Profile data stored on Walrus.',
  urls: [
    { label: 'Website', href: 'https://www.liquidlink.io' },
    { label: 'IOTA App', href: 'https://iota.liquidlink.io' },
    { label: 'Snap', href: 'https://snap.liquidlink.io' },
    { label: 'Twitter/X', href: 'https://x.com/Liquidlink_io' },
  ],
  deployers: ['0xd6a54ff7f851b58c19729c11d210d46fd46d702b9d9caff78747de1914c934ee'],
  attribution: `
Previously registered as "Points System" — a generic descriptor from before the team was identified. The real project is **LiquidLink**, modular on-chain incentive infrastructure running on both IOTA and Sui mainnet. The Points System module signature was their original loyalty-engine package; subsequent deploys evolved into a full social-profile + engagement platform.

Public attestation — gold-standard:
- Official site \`liquidlink.io\` — "Modular On-Chain Incentive Infrastructure."
- IOTA-specific app at \`iota.liquidlink.io\`.
- Snap wallet (?) at \`snap.liquidlink.io\`.
- X/Twitter \`@Liquidlink_io\`.
- Press coverage confirms LiquidLink's point system live on IOTA and Sui mainnet with Bucket Protocol + Strater (Sui) integrations, on-chain profiles, referral system, points-system SDK. Profile data stored on Walrus. Developing social features.

On-chain: deployer \`0xd6a5…34ee\` has published **11 packages** grouped into four distinct module signatures, visible as product evolution:

1. **Original Points System core** — \`{constant, event, point, profile}\` exact set, 4 upgrade versions (\`0x12fc1744…\`, \`0x249dd22d…\`, \`0xcc62dc17…\`, \`0x2ecd5a5d…\`). Matches the prior "Points System" rule.
2. **Refactored core** — \`{core, events}\`, 2 versions (\`0x4d628110…\`, \`0x4d0f8380…\`). Simpler v2 of the points engine.
3. **Utility packages** — \`{utils}\` alone, 2 versions (\`0x6d0efef8…\`, \`0xf9fa275e…\`). Shared utilities.
4. **LiquidLink profile + social layer** — \`{iota_liquidlink_profile}\` alone (1 pkg) + \`{iota_liquidlink_profile, like}\` (2 versions). Profile NFTs + engagement tracker.

Module introspection of the latest LiquidLink-branded package:
\`\`\`
module iota_liquidlink_profile (5 fn, 5 structs):
  structs: AdminCap, EditCap, IOTA_LIQUIDLINK_PROFILE, ProfileNFT, ProfileRegistry
  functions: get_profile_id, init, mint_to_user, update_image, update_texts

module like (3 fn, 2 structs):
  structs: LikeEvent, LikeTracker
  functions: get_like_count, give_like, migrate
\`\`\`

Profile NFTs with image/text metadata, a registry, and a like tracker — a mini social network on-chain.

Triangulation:
- [x] LiquidLink publicly runs on IOTA mainnet, documented on their own site + press coverage.
- [x] Module name \`iota_liquidlink_profile\` literally embeds the brand — irrefutable.
- [x] Product-evolution pattern (simple points → social profile + like engagement) matches LiquidLink's published roadmap.
- [x] Multi-chain deployment (IOTA + Sui) matches LiquidLink's documented architecture.
- [x] Only one deployer on IOTA mainnet ships the \`iota_liquidlink_profile\` module.
`.trim(),
};
