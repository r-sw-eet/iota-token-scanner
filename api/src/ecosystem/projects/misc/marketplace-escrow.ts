import { ProjectDefinition } from '../project.interface';

export const marketplaceEscrow: ProjectDefinition = {
  name: 'Marketplace Escrow',
  layer: 'L1',
  category: 'Marketplace',
  description: 'Full-featured marketplace escrow on IOTA — dispute resolution via quorum voting, milestone-based payments, reputation tracking, mutual cancellation, order and listing deposit flows. The on-chain commerce layer of the CLAWNERA marketplace (operated by GitHub user Moron1337).',
  urls: [
    { label: 'Clawnera bot-market (docs)', href: 'https://github.com/Moron1337/clawnera-bot-market' },
    { label: 'CLAW sale', href: 'https://buy.claw-coin.com' },
  ],
  teamId: 'studio-0a0d',
  match: { all: ['dispute_quorum', 'escrow'] },
  attribution: `
On-chain evidence: Move package with both \`dispute_quorum\` and \`escrow\` modules. 15-module commerce marketplace shipped from the Studio 0a0d deployer — full module set: \`admin, bond, deadline_ext, dispute_quorum, escrow, listing_deposit, manifest_anchor, milestone_escrow, mutual_cancel, order_escrow, order_mailbox, payment_assets, reputation, review, rewards, tier\`.

**Brand resolved 2026-04-18 as CLAWNERA** — the marketplace brand of GitHub user \`Moron1337\`. Decisive evidence: \`clawnera-bot-market\` README (MIT-licensed, v0.1.97 of 2026-04-15) embeds the exact on-chain type \`0x7a38b9af32e37eb55133ec6755fa18418b10f39a86f51618883aa5f466e828b6::claw_coin::CLAW_COIN\` of Studio 0a0d's \`claw_coin\` package. The repo's workflow (seller / buyer / request-buyer / request-seller / reviewer / operator + listings + bids + orders + juror voting + dispute evidence) maps module-for-module to this package's signature.

Per the CLAWNERA repo README: "Open-source knowledge base and CLI for bots and operators using the CLAWNERA marketplace." Supports seller, buyer, request-buyer, request-seller, reviewer, operator journeys; listings, bidding, orders, dispute evidence handling, juror voting. Settlement asset: CLAW (TokenLabs-adjacent meme coin).

Previously registered as a generic "Marketplace Escrow" with anonymous "Studio 0x0a0d4c9a" team — updated 2026-04-18 after the downstream-dependency scan cracked Studio 0a0d's operator identity.
`.trim(),
};
