import { Team } from '../team.interface';

export const virtue: Team = {
  id: 'virtue',
  name: 'Virtue Money',
  description: 'First native stablecoin (VUSD) protocol on IOTA Rebased — CDP architecture. Single-deployer team; 36 packages across the Framework / VUSD Treasury / Oracle / CDP / Stability Pool components and their upgrades, rule packages, and incentive add-ons.',
  urls: [
    { label: 'App', href: 'https://virtue.money' },
    { label: 'Docs', href: 'https://docs.virtue.money' },
  ],
  deployers: ['0xf67d0193e9cd65c3c8232dbfe0694eb9e14397326bdc362a4fe9d590984f5a12'],
  logo: '/logos/virtue.svg',
  attribution: `
Gold-standard attribution: Virtue's own docs publish the five canonical contract addresses at \`docs.virtue.money/resources/technical-resources\` — Framework \`0x7400af4…083b\`, VUSD Treasury \`0xd3b63e6…904f\`, Oracle \`0x7eebbee…c2cf\`, CDP \`0x34fa327…dd22\`, Stability Pool \`0xc7ab9b9…d83b\`. All five are deployed by this single team deployer. MoveBit audit (github.com/Virtue-CDP/virtue-audits/blob/main/Virtue-Audit-Movebit-20250710.pdf) confirms source at \`github.com/Virtue-CDP/move-contracts\`, July 10 2025 — independent certification of the repo/deployer link.

**Correction (2026-04-18):** a second deployer \`0x14effa2d…c3e0\` was previously tracked here as Virtue's main deployer. It's actually **CyberPerp's** L1 Move deployer — its 11 packages include a 19-module GMX-style perps fork (\`delegates, liquidity_pool, market, price_oracle, trading, …\`), a \`cyb\` coin module, and CyberPerp's OFT wrapper. Removed here and re-attributed to a standalone \`cyberperp\` team. The Virtue project match rule was rewritten at the same time: it previously used \`{all: [liquidity_pool, delegates]}\`, which matched CyberPerp's GMX fork, not Virtue.
`.trim(),
};
