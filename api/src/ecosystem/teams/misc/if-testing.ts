import { Team } from '../team.interface';

export const ifTesting: Team = {
  id: 'if-testing',
  name: 'IOTA Foundation (Testing)',
  description: 'Internal test deployments — gas station validation, transfer tests, comparison campaigns. Packages share the single-module `nft` pattern with tags like `gas_station_*`, `transfer_test`, `regular_comparison`. Circumstantial attribution — TWIN Foundation involvement is a plausible refinement for some packages (see attribution).',
  urls: [{ label: 'IOTA Foundation', href: 'https://www.iota.org' }],
  deployers: [
    '0xb83948c6db006a2d50669ff9fc80eef8a3a958bd3060050865fe9255fa4e5521',
    '0x278f2a12f9cb6f2c54f6f08bad283c3abc588696fadff6cf9dd88fd20019afeb',
    '0x164625aaa09a1504cd37ba25ab98525cf2e15792f06a12dd378a044a0d719abe',
  ],
  logo: '/logos/iota.svg',
  attribution: `
Deployers identified by observing the \`tag\` values on NFTs minted from their packages: \`gas_station_*\`, \`transfer_test\`, \`regular_comparison\` — IF-internal test naming, not a branded product. 79 packages total, all single-module \`nft\` with the Salus-shared NFT schema (\`{id, immutable_metadata, tag, metadata, issuer, issuerIdentity, ownerIdentity, network}\`), strongly suggesting IF-operated campaigns validating gas-station flows. Intentionally kept as a separate team (not merged into \`iota-foundation\`) so the NFT-Collections bucket's team-deployer routing still fires.

**Shared-deployer note (2026-04-18):** \`0x164625aa…19abe\` also publishes TWIN Foundation's \`verifiable_storage\` packages (6 of 17 packages at this deployer). The TWIN project rule \`{all: [verifiable_storage]}\` fires earlier in ALL_PROJECTS than the NFT-Collections aggregate, so the 6 TWIN packages route cleanly to \`twin-foundation\`; the remaining 11 \`nft\` test fixtures continue to route to this team via the NFT-Collections bucket. No change to the deployer list required. A future refinement may split "TWIN Foundation (Testing)" out from the IF-proper campaigns once enough evidence lands.
`.trim(),
};
