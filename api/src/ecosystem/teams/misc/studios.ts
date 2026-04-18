import { Team } from '../team.interface';

export const studioB8b1: Team = {
  id: 'studio-b8b1',
  name: 'Studio 0xb8b1380e',
  description: 'Prolific anonymous developer shipping a multi-product deployer key — KrillTube, GiveRep-style claim, and multiple on-chain games (Chess, Tic-Tac-Toe, 2048, Gift Drop) plus Vault / gas-station utility. Dev-shop vs. single-team ownership is an open question.',
  deployers: ['0xb8b1380eb2f879440e6f568edbc3aab46b54c48b8bfe81acbc1b4cf15a2706c6'],
  attribution: `
Anonymous developer identified only by their deployer prefix (\`0xb8b1380e…\`). The team name "Studio 0xb8b1380e" is synthetic — coined from the address because no public brand is publicly attached to the deployer as a whole. Sub-products include \`tunnel\` + \`demo_krill_coin\` (KrillTube, https://krill.tube/), \`giverep_claim\` (GiveRep-style claim package — GiveRep's primary deployment is Sui), Chess / Tic-Tac-Toe / 2048 / Gift Drop games, and \`vault\` + \`gas_station\` utility packages. Three plausible ownership stories: (a) single team behind all products, (b) dev shop servicing multiple clients, (c) IF-adjacent contractor. Evidence leans (a) because the \`tic_tac_iota::AdminCap\` is held directly by the deployer; not conclusive.
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
Previously 🟠 UNVERIFIED and attributed to a synthetic "Studio 0x0a0d4c9a" label. Hard-linked 2026-04-18 via downstream-dependency scan + coin-metadata icon probing. Chain of evidence:

1. Scanning all 747 mainnet packages for linkage pointing at Studio 0a0d packages: zero external downstream customers, but three \`spec_sale_v2\` packages depend on \`spec_coin\` at a DIFFERENT deployer (\`0x4468c8dd…\`, SPEC-coin-only, 2 packages) — logically the same team using a dedicated token key.
2. SPEC CoinMetadata icon URL: \`raw.githubusercontent.com/Moron1337/SPEC/main/Spec.png\`. CLAW CoinMetadata icon URL: \`raw.githubusercontent.com/Moron1337/CLAW/main/logo/claw.png\`.
3. GitHub user \`Moron1337\` has 4 public repos: \`SPEC\`, \`CLAW\`, \`openclaw-iota-wallet\`, **\`clawnera-bot-market\`**.
4. \`clawnera-bot-market\` README (MIT-licensed, v0.1.97 of 2026-04-15) embeds the exact on-chain type \`0x7a38b9af…::claw_coin::CLAW_COIN\` — which is package #10 in our Studio 0a0d inventory. **Direct contract-address match** — strongest single signal.
5. The repo's workflow (seller / buyer / reviewer / operator + listings + bids + orders + juror voting + dispute evidence) maps module-for-module to Studio 0a0d's 15 commerce packages (\`order_escrow\`, \`dispute_quorum\`, \`manifest_anchor\`, \`reputation\`, \`review\`, \`tier\`, \`milestone_escrow\`, \`bond\`, etc.).
6. Both tokens use 1,337-based max supply (meme-coin / leet numerology signature consistent with a single operator).

Kept the synthetic team id \`studio-0a0d\` rather than renaming to \`clawnera\` pending confirmation that the operator wants to be surfaced under the Clawnera brand publicly on our site; the team name surfaces the brand so users see it.
`.trim(),
};
