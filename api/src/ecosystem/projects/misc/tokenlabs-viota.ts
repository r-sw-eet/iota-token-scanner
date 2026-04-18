import { ProjectDefinition } from '../project.interface';

export const tokenlabsVIota: ProjectDefinition = {
  name: 'TokenLabs Liquid Staking (vIOTA)',
  layer: 'L1',
  category: 'Liquid Staking',
  description: 'TokenLabs\' liquid staking product. Users stake IOTA and receive vIOTA, an LST that accrues validator rewards while remaining liquid. **Second liquid-staking protocol on IOTA Rebased** alongside Swirl\'s stIOTA.',
  urls: [{ label: 'Website', href: 'https://tokenlabs.network' }],
  teamId: 'tokenlabs',
  match: { packageAddresses: [
    '0xe4abf8b6183c106282addbfb8483a043e1a60f1fd3dd91fb727fa284306a27fd', // vIOTA v1
    '0x6ab984dfae09bbef27551765622a85f461e0b46629eee60807b6e5399c0f7f0f', // vIOTA v2 upgrade
  ] },
  attribution: `
On-chain evidence: two exact package addresses at TokenLabs' admin/operator deployer \`0x5555…ae7c\` — the vIOTA v1 and v2 packages. Both carry the module set \`{cert, math, native_pool, ownership, validator_set}\`.

Pinned by address rather than module signature because \`{cert, math, native_pool, ownership, validator_set}\` false-positively matches **9 non-TokenLabs packages** on mainnet (confirmed via whole-mainnet scan). Deployers \`0x119191cd…\` and \`0x13b068af…\` publish unrelated packages with the same 5-module shape. Accept the cost of updating this def when TokenLabs ships a vIOTA v3; the alternative (a module-based rule) would silently mis-attribute 9 other packages.

**Liquid-staking landscape**: TokenLabs' vIOTA is the second LST on IOTA. Before this pass our registry surfaced only Swirl; both now show up, making IOTA's two-LST reality legible on the site.

A related dead def — "Swirl Validator" \`{all: [cert, native_pool, validator]}\` — was dropped in the same pass. That rule matched zero packages on mainnet: TokenLabs uses \`validator_set\` (plural), not \`validator\`; Swirl itself doesn't publish these modules at all. The def was speculative when authored.
`.trim(),
};
