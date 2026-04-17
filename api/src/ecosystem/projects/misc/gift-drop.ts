import { ProjectDefinition } from '../project.interface';

export const giftDrop: ProjectDefinition = {
  name: 'Gift Drop',
  layer: 'L1',
  category: 'Airdrop',
  description: 'IOTA gift drop mechanism for distributing tokens to recipients via claimable on-chain vouchers. Used for promotional airdrops and community reward campaigns.',
  urls: [],
  teamId: 'studio-b8b1',
  match: { all: ['giftdrop_iota'] },
  attribution: `
On-chain evidence: Move package with module \`giftdrop_iota\`.

"Gift Drop" is our descriptive label for a claimable-voucher airdrop contract. The module name is literal (IOTA-flavored suffix). Deployed by Studio 0xb8b1380e, the same anonymous studio that ships the games bundle.
`.trim(),
};
