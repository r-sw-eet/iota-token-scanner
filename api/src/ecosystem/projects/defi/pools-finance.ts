import { ProjectDefinition } from '../project.interface';

export const poolsFinance: ProjectDefinition = {
  name: 'Pools Finance',
  layer: 'L1',
  category: 'DEX (AMM)',
  description: 'First decentralized exchange on IOTA Rebased, built with MoveVM. Provides automated market maker swaps, liquidity pools, and token staking. Uses a constant-product AMM model optimized for low gas costs on IOTA.',
  urls: [
    { label: 'App', href: 'https://pools.finance' },
  ],
  teamId: 'pools-finance',
  match: { all: ['amm_config', 'amm_router'] },
  attribution: `
On-chain evidence: a single Move package contains both \`amm_config\` and \`amm_router\` modules.

"Pools Finance" is not on-chain — it's our label. We believe packages with this module pair are Pools Finance because:

- \`amm_router\` + \`amm_config\` is the canonical naming pattern for a constant-product AMM (router handles swap routing; config holds pool parameters).
- The deployers are the addresses the pools.finance web app calls into — observable by opening their app with browser devtools and inspecting RPC payloads.
- Pools Finance is the first (and so far only) DEX on IOTA Rebased. No other IOTA team has published a package with these two module names at the deployer addresses we've registered.
`.trim(),
};

export const poolsFarming: ProjectDefinition = {
  name: 'Pools Farming',
  layer: 'L1',
  category: 'Yield Farming',
  description: 'Yield farming module for Pools Finance. Liquidity providers stake their LP tokens to earn IRT rewards. Supports single and dual reward farming across multiple pools.',
  urls: [
    { label: 'App', href: 'https://pools.finance' },
  ],
  teamId: 'pools-finance',
  match: { all: ['farm', 'irt'] },
  attribution: `
On-chain evidence: a single Move package contains both \`farm\` and \`irt\` modules.

Same team as Pools Finance, different product package. Confirmed by:

- \`irt\` matches Pools Finance's public branding for the farming reward token (see pools.finance docs).
- The farming package is deployed from a dedicated address that the pools.finance app uses for farming interactions.
- That deployer is merged into the main \`pools-finance\` team. This project row stays separate so farming activity (LP stake / unstake / harvest) is distinguishable from DEX swaps.
`.trim(),
};
