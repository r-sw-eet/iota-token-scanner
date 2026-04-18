import { ProjectDefinition } from '../project.interface';

export const tokenlabsVIota: ProjectDefinition = {
  name: 'TokenLabs Liquid Staking (vIOTA)',
  layer: 'L1',
  category: 'Liquid Staking',
  description: 'IOTA\'s second liquid-staking protocol (alongside Swirl). Users stake IOTA and receive vIOTA, a liquid staking token. Two mainnet versions (v1 + v2) published by the TokenLabs admin/operator deployer.',
  urls: [{ label: 'Website', href: 'https://tokenlabs.network' }],
  teamId: 'tokenlabs',
  match: { packageAddresses: [
    // vIOTA v1 + v2 — pinned by address rather than module signature because
    // `{cert, math, native_pool, ownership, validator_set}` false-positively
    // matches 9 non-TokenLabs packages on mainnet. Update here when
    // TokenLabs ships v3.
    '0xe4abf8b6183c106282addbfb8483a043e1a60f1fd3dd91fb727fa284306a27fd', // vIOTA v1
    '0x6ab984dfae09bbef27551765622a85f461e0b46629eee60807b6e5399c0f7f0f', // vIOTA v2 upgrade
  ] },
  attribution: `
On-chain evidence: two hardcoded package addresses at TokenLabs' admin/operator deployer \`0x5555…ae7c\` — the vIOTA v1 and v2 packages.

Pinned by address rather than by module signature because the \`{cert, native_pool, validator_set}\` module set false-positively catches 9 non-TokenLabs packages (confirmed via whole-mainnet scan). Accept the cost of having to update this def when TokenLabs ships v3. Makes IOTA's liquid-staking landscape two-protocol (Swirl + TokenLabs vIOTA); previously only Swirl was surfaced.
`.trim(),
};
