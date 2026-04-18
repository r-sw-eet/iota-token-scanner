import { Team } from '../team.interface';

export const twinFoundation: Team = {
  id: 'twin-foundation',
  name: 'TWIN Foundation',
  description: 'TWIN (Trade Worldwide Information Network) — Swiss non-profit foundation for digital trade infrastructure, built on IOTA.',
  urls: [
    { label: 'TWIN', href: 'https://www.twin.org' },
    { label: 'Dev docs', href: 'https://twindev.org' },
    { label: 'GitHub', href: 'https://github.com/twinfoundation' },
  ],
  deployers: ['0x164625aaa09a1504cd37ba25ab98525cf2e15792f06a12dd378a044a0d719abe'],
  logo: '/logos/iota.svg',
  attribution: `
Deployer \`0x164625aa…19abe\` publishes the \`verifiable_storage\` package line that TWIN apps use to anchor W3C Verifiable Credentials of type ImmutableProof. Attribution anchors on https://manifesto.iota.org/, which explicitly links to mainnet tx \`GJ6arr…MhEc\` as TWIN's "first mainnet transactions" — that tx is a MoveCall into this deployer's package \`0xf951…cc13\`, and the VC payload references \`schema.twindev.org/immutable-proof/\` (TWIN's official schema domain). Kept separate from \`if-tlip\` because TWIN Foundation is the parent org and TLIP is one of its country deployments; keeping them distinct makes the TLIP-customs vs. TWIN-generic-anchor split legible in the listing.
`.trim(),
};
