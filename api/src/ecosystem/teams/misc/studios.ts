import { Team } from '../team.interface';

export const studioB8b1: Team = {
  id: 'studio-b8b1',
  name: 'Studio 0xb8b1380e',
  description: 'Multi-brand dev-shop deployer shipping 37 packages across KrillTube (decentralized video), GiveRep (SocialFi reputation, IOTA side), an on-chain games portfolio (Chess / Tic Tac Toe / 2048), and shared infrastructure (vault, gas_station, gift drop). Single-team vs. dev-shop ownership is an open question — evidence leans single-team, not conclusive.',
  deployers: ['0xb8b1380eb2f879440e6f568edbc3aab46b54c48b8bfe81acbc1b4cf15a2706c6'],
  attribution: `
Previously registered as a generic "anonymous developer." Partial identification 2026-04-17 via live-object inspection — the deployer ships code for multiple branded products, making it a dev-shop / multi-tenant infrastructure publisher rather than a single anonymous studio.

**Identified brands:**

- **KrillTube** ([x]) — Decentralized video platform at \`krill.tube\`.
  - On-chain evidence: \`tunnel::CreatorConfig\` objects carry metadata like \`"KrillTube Video - eb13e51b-9e01-424a-87a7-ca4e80111218"\`. Operator address \`0xba1e07d0a5db4ed0aab5ada813c3abb8a58f4d34ba19b153f19c70d6e163020d\` administers the tunnel/KrillTube infrastructure.
  - Product: watch-to-earn + upload-to-earn video platform using a "Krill" token. Content stored on Walrus (encrypted). Mascot Krilly.
  - Packages: \`tunnel\`, \`demo_krill_coin\`.

- **GiveRep** ([x]) — SocialFi reputation platform at \`giverep.com\`.
  - On-chain evidence: \`giverep_claim::Pool\`, \`giverep_claim::SuperAdmin\` objects shared by multiple users.
  - Product: converts social-media engagement (X/Twitter) into on-chain $REP points. Launched late April 2025.
  - Primary deployment on Sui; IOTA is the secondary deployment (IOTA Foundation's Ambassador Program migrated to GiveRep).
  - Confirmed via press: "Over 750,000 $IOTA (~$108K USD) distributed to LiquidLink users via GiveRep campaigns" (LiquidLink cross-integration).

**Unbranded products at the same deployer:**

- **Games portfolio:** Chess (3 versions), Tic Tac Toe (3 versions with AdminCap, Treasury, Game, Trophy structs), 2048 Game (with \`campaign_rewards\` module + RewardCapStore). Multiple individual player creator addresses visible as Game creators — anyone-can-play on-chain games.
- **Infrastructure utilities:** vault (multiple variants — different creators have their own VaultManagers), \`gas_station\`, \`giftdrop_iota\` (multiple versions).

**Attribution interpretation:**

Not one team with one brand — a dev shop or dApp kit publisher servicing multiple products. Three plausible stories:

1. **Single team, multiple products.** Same dev team iterates on GiveRep, launches KrillTube, ships on-chain games as showcase / hackathon outputs.
2. **Dev shop operating multiple clients.** One technical team with several product brands sharing a deployer key.
3. **Shared IOTA Foundation-adjacent infrastructure.** IOTA Foundation's Ambassador Program uses GiveRep on IOTA; KrillTube may be IF-affiliated; the deployer could be an IF-adjacent contractor.

Evidence leans (1): \`tic_tac_iota::AdminCap\` is owned directly by the deployer \`0xb8b1380e…\`, and Chess/2048 Treasury objects are shared-object-administered by the deployer. That suggests the deployer directly administrates the games (not handed off to other teams). Not conclusive.
`.trim(),
};

export const studio0a0d: Team = {
  id: 'studio-0a0d',
  name: 'Studio 0x0a0d4c9a (Clawnera / Spec Weekly)',
  description: 'Operated by GitHub user Moron1337 — CLAWNERA marketplace, CLAW meme-coin, SPEC launchpad, and an IOTA Discord #speculations community presence. Meme-coin adjacent; formally a one-person / small-community operation with no registered company.',
  urls: [
    { label: 'CLAW sale', href: 'https://buy.claw-coin.com' },
    { label: 'SPEC sale', href: 'https://buy.spec-coin.cc' },
    { label: 'GitHub (Moron1337)', href: 'https://github.com/Moron1337' },
  ],
  deployers: [
    '0x0a0d4c9a9f935dac9f9bee55ca0632c187077a04d0dffcc479402f2de9a82140',
    '0x4468c8ddb42728fd1194033c1dd14ffd015f0d81e4b5329ddc11793c989f3f39',
  ],
  attribution: `
Previously 🟠 UNVERIFIED and attributed to a synthetic "Studio 0x0a0d4c9a" label. Hard-linked 2026-04-18 via downstream-dependency scan + coin-metadata icon probing.

Scanning all 747 mainnet packages for \`linkage\` pointing at Studio 0a0d packages returned zero external downstream customers — but the reverse direction broke the case. Three \`spec_sale_v2\` packages depend on \`spec_coin\` at a DIFFERENT deployer (\`0x4468c8dd…\`, SPEC-coin-only, 2 packages) — logically the same team using a dedicated token key.

Chain of evidence:

1. SPEC CoinMetadata icon URL: \`raw.githubusercontent.com/Moron1337/SPEC/main/Spec.png\`.
2. CLAW CoinMetadata icon URL: \`raw.githubusercontent.com/Moron1337/CLAW/main/logo/claw.png\`.
3. GitHub user \`Moron1337\` has 4 public repos: \`SPEC\`, \`CLAW\`, \`openclaw-iota-wallet\`, **\`clawnera-bot-market\`**.
4. \`clawnera-bot-market\` README (MIT-licensed, v0.1.97 of 2026-04-15) embeds the exact on-chain type \`0x7a38b9af32e37eb55133ec6755fa18418b10f39a86f51618883aa5f466e828b6::claw_coin::CLAW_COIN\` — which is package #10 in our Studio 0a0d inventory. **Direct contract-address match in an MIT-licensed README** — strongest possible single attribution signal.
5. The repo's workflow (seller / buyer / request-buyer / request-seller / reviewer / operator + listings + bids + orders + juror voting + dispute evidence) maps module-for-module to Studio 0a0d's 15 commerce packages: \`order_escrow\`, \`dispute_quorum\`, \`manifest_anchor\`, \`reputation\`, \`review\`, \`tier\`, \`milestone_escrow\`, \`bond\`, \`deadline_ext\`, \`escrow\`, \`listing_deposit\`, \`mutual_cancel\`, \`order_mailbox\`, \`payment_assets\`, \`rewards\`, \`admin\`.
6. Both tokens use 1,337-based max supply (SPEC: 1.337e12, CLAW: 1.337e19 = 1337 × 10^16 at 6 decimals) — meme-coin / leet numerology signature consistent with a single operator.

Brand names revealed:
- **Marketplace:** CLAWNERA (previously unknown on-chain).
- **Token:** CLAW (symbol; "Claw Coin" name; icon \`claw.png\`).
- **Launchpad:** SPEC (sale UI at \`buy.spec-coin.cc\` states the project was "born in the speculative depths of the #speculations channel on IOTA Discord"; meme-coin disclaimer).
- **Operator handle:** \`Moron1337\` (GitHub).
- **Public presence:** Spec Weekly YouTube channel (\`youtube.com/c/SpecWeekly\`, tagline "Speculation for IOTA, Shimmer, and Crypto degenerates") + IOTA Discord \`#speculations\`.
- **Company:** no formal team — reads as a one-person / small community-run meme-coin project.

Kept the synthetic team id \`studio-0a0d\` rather than renaming to \`clawnera\` pending confirmation the operator wants to be surfaced under the Clawnera brand publicly on our site; the team name surfaces the brand so users see it.
`.trim(),
};
