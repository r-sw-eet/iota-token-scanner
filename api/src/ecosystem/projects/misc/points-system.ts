import { ProjectDefinition } from '../project.interface';

export const pointsSystem: ProjectDefinition = {
  name: 'Points System',
  layer: 'L1',
  category: 'Loyalty',
  description: 'On-chain points and profile system on IOTA Rebased. Tracks user engagement across the ecosystem with verifiable point balances and profile metadata stored as Move objects.',
  urls: [],
  teamId: 'points-system',
  match: { exact: ['constant', 'event', 'point', 'profile'] },
  attribution: `
On-chain evidence: Move package whose module set is exactly \`{constant, event, point, profile}\`.

Exact-set match because each individual module name is generic; the **combination** of all four in a single package is what makes the signature specific. "Points System" is our descriptive label — the module names describe a classic loyalty/points engine (profile records, point balances, event tracking). Single known deployer; no public brand linked yet.
`.trim(),
};
