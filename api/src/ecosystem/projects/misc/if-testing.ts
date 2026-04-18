import { ProjectDefinition } from '../project.interface';

export const ifTesting: ProjectDefinition = {
  name: 'IOTA Foundation (Testing)',
  layer: 'L1',
  category: 'Testing',
  description: 'Internal test deployments by the IOTA Foundation — gas station validation, transfer tests, and comparison campaigns. 79 packages across three deployers, each a single-module `nft` package; NFT instances carry tags like `gas_station_*`, `transfer_test`, `regular_comparison`. Packages reach this project exclusively via deployer-based team routing out of the NFT Collections aggregate bucket — the module matcher intentionally claims nothing directly.',
  urls: [{ label: 'IOTA Foundation', href: 'https://www.iota.org' }],
  teamId: 'if-testing',
  match: {},
  attribution: `
On-chain evidence: no direct module or address rule. This project has an empty \`match\` block and is reached exclusively via **team-deployer routing** — \`NFT Collections\` is an aggregate bucket (\`splitByDeployer: true\`); when a sub-project's deployer belongs to a team with exactly one project (us), the scanner routes the sub-project to this row.

Circumstantial attribution (🟡, not [x]). 79 packages across three deployers, all single-module \`nft\` with the Salus-shared NFT schema (\`{id, immutable_metadata, tag, metadata, issuer, issuerIdentity, ownerIdentity, network}\`). Tag vocabulary observed in-sample: \`gas_station_*\`, \`transfer_test\`, \`regular_comparison\`, \`complex_tag\`, \`test_tag\` — IF-internal test naming, not a branded product. 79 packages is institutional-scale volume; individual developers don't mint that many mainnet test packages. IF publicly runs a Gas Station product at \`blog.iota.org/iota-gas-station-alpha\`, matching the \`gas_station_*\` tag pattern we observe.

**Shared-deployer note (2026-04-18):** one of the three deployers (\`0x164625aa…\`) also publishes TWIN Foundation's \`verifiable_storage\` packages. Of 17 packages at this deployer, 6 are TWIN (claimed by the TWIN rule earlier in \`ALL_PROJECTS\`); the remaining 11 \`nft\` fixtures continue to route here. A future refinement may split "TWIN Foundation (Testing)" off from the IF-proper campaigns — the tag vocabulary + gas-station dependency fits TWIN Foundation testing better than IF-proper for some packages.

Kept as its own single-project team so team-deployer routing fires. If we merged \`if-testing\` into the consolidated \`iota-foundation\` team, the team would have many projects and routing would stop — the IF test NFTs would fall back into the NFT Collections bucket as anonymous per-deployer sub-projects.
`.trim(),
};
