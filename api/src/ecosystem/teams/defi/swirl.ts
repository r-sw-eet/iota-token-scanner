import { Team } from '../team.interface';

export const swirl: Team = {
  id: 'swirl',
  name: 'Swirl',
  description: 'First liquid staking protocol on IOTA Rebased. Operated by Ankr\'s enterprise-services arm Asphere; internal codename "StakeFi". Users stake IOTA and receive stIOTA (rIOTA internally), a rebasing LST used as DeFi collateral across the ecosystem.',
  urls: [
    { label: 'App', href: 'https://swirlstake.com' },
    { label: 'Docs', href: 'https://docs.swirlstake.com' },
  ],
  deployers: ['0x043b7d4d89c36bfcd37510aadadb90275622cf603344f39b29648c543742351c'],
  logo: '/logos/swirl.svg',
  attribution: `
Gold-standard attribution via Hacken's audit report linked directly from Swirl's docs (\`docs.swirlstake.com\`). Audit front matter:

- Customer: **ANKR** (Ankr's enterprise-services arm, Asphere, is publicly identified as Swirl's co-engineer in launch coverage at Bitget, CryptoNews, CryptoRank).
- Internal product name: **"StakeFi"** — "a project that implements a liquid staking system for IOTA, combining modules for validator management, staking operations, mathematical utilities, and a reward-bearing CERT token that appreciates in value to reflect accumulated staking rewards."
- Website: \`http://swirlstake.com/\`
- Platform: IOTA
- Language: Move
- Repository: \`github.com/Ankr-network/stakefi-iota-smart-contract\`
- Commit audited: \`e18946f\` · Remediation commit: \`1541f5d\`
- Auditor: Hacken OÜ, Tallinn, Estonia — March 25, 2025.

The chain of branding: Swirl (public) = StakeFi (Ankr's internal codename) = the audited codebase at \`Ankr-network/stakefi-iota-smart-contract\`. All three labels are explicitly bridged by the Hacken report.

On-chain: deployer \`0x043b…351c\` has published exactly 4 packages, all with the identical 2-module signature \`{pool, riota}\` — four upgrade versions of the same liquid-staking core. \`pool\` is Swirl's NativePool / liquidity-pool primitive (Hacken tags: "Liquidity Pool") where IOTA gets staked; \`riota\` is the receipt-token type (a.k.a. "rIOTA" internally / CERT in Hacken's description / marketed as stIOTA to users). No other Move package on IOTA mainnet contains this exact \`{pool, riota}\` module pair. Deployer has zero off-topic packages — perfectly clean footprint for a single-product team.

Triangulation:
- [x] Swirl's docs link to the Hacken audit as their official security review.
- [x] Hacken names Ankr as the customer and "StakeFi … liquid staking system for IOTA" as the audited product.
- [x] Press coverage (Bitget, CryptoNews) confirms Ankr's Asphere co-engineers Swirl.
- [x] Swirl is the only liquid-staking protocol on IOTA per IOTA's ecosystem listings and Swirl's own "first" claim (until TokenLabs' vIOTA shipped as the second LST).
- [x] On-chain scan: exactly one deployer on mainnet publishes packages with the \`{pool, riota}\` signature.
`.trim(),
};
