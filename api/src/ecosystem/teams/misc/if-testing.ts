import { Team } from '../team.interface';

export const ifTesting: Team = {
  id: 'if-testing',
  name: 'IOTA Foundation (Testing)',
  description: 'Internal test deployments — gas station validation, transfer tests, comparison campaigns. Packages share the single-module `nft` pattern with tags like `gas_station_*`, `transfer_test`, `regular_comparison`. Attributed based on observed tag patterns across multiple deployers.',
  urls: [{ label: 'IOTA Foundation', href: 'https://www.iota.org' }],
  deployers: [
    '0xb83948c6db006a2d50669ff9fc80eef8a3a958bd3060050865fe9255fa4e5521',
    '0x278f2a12f9cb6f2c54f6f08bad283c3abc588696fadff6cf9dd88fd20019afeb',
    '0x164625aaa09a1504cd37ba25ab98525cf2e15792f06a12dd378a044a0d719abe',
  ],
  attribution: `
Deployers identified by observing the \`tag\` values on NFTs minted from their packages: \`gas_station_*\`, \`transfer_test\`, \`regular_comparison\` — clearly IF-internal test naming, not a branded product. Intentionally kept as a separate team (not merged into \`iota-foundation\`) so that the NFT-Collections bucket's team-deployer routing rule still fires (that rule only works when a team has exactly one project).
`.trim(),
};
