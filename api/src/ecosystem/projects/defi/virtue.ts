import { ProjectDefinition } from '../project.interface';

export const virtue: ProjectDefinition = {
  name: 'Virtue',
  layer: 'L1',
  category: 'Stablecoin / CDP',
  description: 'First native stablecoin protocol on IOTA Rebased. Users mint VUSD (USD-pegged stablecoin) by locking wIOTA or stIOTA as collateral in Collateralized Debt Positions. Features fixed-rate borrowing, a unified stability pool, flash loans, and flash minting.',
  urls: [
    { label: 'App', href: 'https://virtue.money' },
    { label: 'Docs', href: 'https://docs.virtue.money' },
  ],
  teamId: 'virtue',
  match: { all: ['liquidity_pool', 'delegates'] },
  attribution: `
On-chain evidence: Move package with both \`liquidity_pool\` and \`delegates\` modules.

Virtue Money is the first native stablecoin (VUSD) protocol on IOTA — CDP architecture, confirmed by:

- The virtue.money app calls into this deployer's packages.
- Virtue's own docs (docs.virtue.money) describe the CDP / liquidity-module structure that matches what we see on-chain.
- The deployer publishes multiple Virtue product packages from the same address.
`.trim(),
};

export const virtueStability: ProjectDefinition = {
  name: 'Virtue Stability',
  layer: 'L1',
  category: 'Stability Pool',
  description: 'Stability pool and borrow incentives for the Virtue protocol. Depositors provide VUSD to absorb liquidations and earn collateral rewards. Part of the Virtue CDP system.',
  urls: [
    { label: 'App', href: 'https://virtue.money' },
  ],
  teamId: 'virtue',
  logo: '/logos/virtue.svg',
  match: { all: ['stability_pool', 'borrow_incentive'] },
  attribution: `
On-chain evidence: Move package with both \`stability_pool\` and \`borrow_incentive\` modules.

Sub-module of Virtue — the stability pool accepts VUSD deposits to absorb liquidations, \`borrow_incentive\` is Virtue's fixed-rate borrowing reward surface (named this way in Virtue's docs). Same team (\`virtue\`); kept as a separate project row because the stability-pool package has its own event profile (deposit / liquidation / reward claim).
`.trim(),
};

export const virtuePool: ProjectDefinition = {
  name: 'Virtue Pool',
  layer: 'L1',
  category: 'Stability Pool',
  description: 'Balance tracking and accounting module for Virtue stability pools. Manages the internal ledger of depositor shares and liquidation gains across the protocol.',
  urls: [
    { label: 'App', href: 'https://virtue.money' },
  ],
  teamId: 'virtue',
  match: { all: ['balance_number', 'stability_pool'] },
  attribution: `
On-chain evidence: Move package with both \`balance_number\` and \`stability_pool\` modules, published from a dedicated deployer (distinct from the main Virtue deployer).

Internal accounting/balance module for the Virtue stability pool — "Virtue Pool" is a short descriptor, not a standalone Virtue product. Confirmed as Virtue by: the deployer address publishes only this package; the module pair shares \`stability_pool\` with the main Virtue Stability package, and the app calls into both in the same flow. The dedicated deployer was merged back into the \`virtue\` team; the row stays separate so balance-accounting events don't get lumped with stability-pool deposits.
`.trim(),
};
