import { ProjectDefinition } from '../project.interface';

export const ifTesting: ProjectDefinition = {
  name: 'IOTA Foundation (Testing)',
  layer: 'L1',
  category: 'Testing',
  description: 'Internal test deployments by the IOTA Foundation — gas station validation, transfer tests, and comparison packages. Packages share the single-module `nft` pattern; NFT instances carry tags like `gas_station_*`, `transfer_test`, `regular_comparison`. Packages reach this project exclusively via deployer-based team routing out of the NFT Collections aggregate bucket — the module matcher intentionally claims nothing directly.',
  urls: [{ label: 'IOTA Foundation', href: 'https://www.iota.org' }],
  teamId: 'if-testing',
  match: {},
  attribution: `
On-chain evidence: no direct module or address rule. This project has an empty \`match\` block and is reached exclusively via **team-deployer routing** — NFT Collections is an aggregate bucket (\`splitByDeployer: true\`); when a sub-project's deployer belongs to a team that has exactly one project (us), the scanner routes the sub-project to this row.

Kept as its own single-project team for that routing to work. If we merged \`if-testing\` into the consolidated \`iota-foundation\` team, the team would have many projects and routing would stop firing — the IF test NFTs would fall back into the NFT Collections bucket as anonymous per-deployer sub-projects. Attribution for each individual test deployer was established by observing the NFT \`tag\` values (\`gas_station_*\`, \`transfer_test\`, \`regular_comparison\`) which are IF-internal naming.
`.trim(),
};
