import { Team } from '../team.interface';

export const virtue: Team = {
  id: 'virtue',
  name: 'Virtue Money',
  description: 'First native stablecoin (VUSD) protocol on IOTA — CDP, stability pool, flash loans. Accounting/balance modules are published from a dedicated deployer but belong to the same team.',
  urls: [
    { label: 'App', href: 'https://virtue.money' },
    { label: 'Docs', href: 'https://docs.virtue.money' },
  ],
  deployers: [
    '0x14effa2d3435b7c462a969db6995003cfd3db97f403ad9dd769d0a36413fc3e0',
    '0xf67d0193e9cd65c3c8232dbfe0694eb9e14397326bdc362a4fe9d590984f5a12',
  ],
  logo: '/logos/virtue.svg',
  attribution: `
Main deployer (\`0x14ef…c3e0\`) identified from the virtue.money app — its mint / borrow / repay flows call into this address. The second deployer (\`0xf67d…5a12\`) publishes a smaller balance-accounting package that used to be tracked as a separate team (\`virtue-pool\`); merged into Virtue because it ships the same stability-pool system under the same brand.
`.trim(),
};
