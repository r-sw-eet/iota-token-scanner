import { ProjectDefinition } from '../project.interface';

export const swirl: ProjectDefinition = {
  name: 'Swirl',
  layer: 'L1',
  category: 'Liquid Staking',
  description: 'First liquid staking protocol on IOTA Rebased. Users stake IOTA and receive stIOTA, a liquid staking token that accrues staking rewards while remaining tradeable and usable as DeFi collateral (e.g., in Virtue CDPs).',
  urls: [
    { label: 'App', href: 'https://swirlstake.com' },
    { label: 'Docs', href: 'https://docs.swirlstake.com' },
  ],
  teamId: 'swirl',
  match: { exact: ['pool', 'riota'] },
  attribution: `
On-chain evidence: Move package whose module set is exactly \`{pool, riota}\` (no more, no less).

Swirl is the first liquid-staking protocol on IOTA — users stake IOTA, receive \`stIOTA\` (called "rIOTA" internally, hence the module name).

- The swirlstake.com app calls into this deployer's packages.
- Swirl's docs (docs.swirlstake.com) describe the two-module core: \`pool\` for the staking vault, \`riota\` for the LST coin type.
- Exact-set match used because both module names are generic enough that a stricter rule guards against false positives.
`.trim(),
};

export const swirlValidator: ProjectDefinition = {
  name: 'Swirl Validator',
  layer: 'L1',
  category: 'Liquid Staking',
  description: 'Validator pool management contracts for Swirl. Handles delegation of staked IOTA across the validator set, certificate issuance, and native pool rebalancing.',
  urls: [
    { label: 'App', href: 'https://swirlstake.com' },
  ],
  teamId: 'swirl',
  logo: '/logos/swirl.svg',
  match: { all: ['cert', 'native_pool', 'validator'] },
  attribution: `
On-chain evidence: Move package with modules \`cert\`, \`native_pool\`, and \`validator\`.

Sub-module of Swirl — manages validator delegation and certificate issuance for the liquid-staking protocol. "Swirl Validator" is our descriptive label; the Swirl team doesn't market it as a standalone product. Confirmed as Swirl via deployer overlap with the main Swirl package.
`.trim(),
};
