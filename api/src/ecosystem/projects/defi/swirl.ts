import { ProjectDefinition } from '../project.interface';

export const swirl: ProjectDefinition = {
  name: 'Swirl',
  layer: 'L1',
  category: 'Liquid Staking',
  description: 'First liquid staking protocol on IOTA Rebased. Users stake IOTA and receive stIOTA (rIOTA internally), a liquid staking token that accrues staking rewards while remaining tradeable and usable as DeFi collateral (e.g., in Virtue CDPs).',
  urls: [
    { label: 'App', href: 'https://swirlstake.com' },
    { label: 'Docs', href: 'https://docs.swirlstake.com' },
  ],
  teamId: 'swirl',
  match: { exact: ['pool', 'riota'] },
  attribution: `
On-chain evidence: Move package whose module set is exactly \`{pool, riota}\` (no more, no less).

Swirl is IOTA's first liquid-staking protocol — the Move package exposes \`pool\` (the staking vault) and \`riota\` (the LST coin type, called "rIOTA" internally; marketed as stIOTA). The swirlstake.com app and docs describe exactly this two-module core. Exact-set match guards against future collisions with generic \`pool\`/\`riota\` module names.

**Note:** a \`Swirl Validator\` def (matching \`{cert, native_pool, validator}\`) previously sat here. Dropped 2026-04-18 after a whole-mainnet scan confirmed zero matches — Swirl doesn't ship a \`validator\`-named module; TokenLabs uses \`validator_set\` instead. The def was speculative when authored and confirmed dead.
`.trim(),
};
