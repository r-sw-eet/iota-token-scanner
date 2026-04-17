import { ProjectDefinition } from '../project.interface';

export const vault: ProjectDefinition = {
  name: 'Vault',
  layer: 'L1',
  category: 'Vault',
  description: 'Token vault contracts on IOTA Rebased. Provides secure custody and controlled access to pooled tokens, used as building blocks by other DeFi protocols.',
  urls: [],
  teamId: 'studio-b8b1',
  match: { exact: ['vault'] },
  attribution: `
On-chain evidence: Move package whose module set is exactly \`{vault}\` (a single module, nothing else).

"Vault" is our descriptive label — the module name is literal. Exact-set match used because a single-module package with a generic name could false-positive against many unrelated contracts; requiring exactly that one module restricts it. Deployed by Studio 0xb8b1380e.
`.trim(),
};
