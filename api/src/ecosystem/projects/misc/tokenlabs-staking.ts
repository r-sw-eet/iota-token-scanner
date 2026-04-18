import { ProjectDefinition } from '../project.interface';

export const tokenlabsStaking: ProjectDefinition = {
  name: 'TokenLabs Staking Framework',
  layer: 'L1',
  category: 'Staking',
  description: 'Generic staking framework TokenLabs ships to other IOTA teams — configurable staking pools, reward schedules, and entry/exit conditions. Consumed by third-party products (e.g. IotaRoyale\'s TLN farm).',
  urls: [{ label: 'Website', href: 'https://tokenlabs.network' }],
  teamId: 'tokenlabs',
  match: { all: ['stake', 'stake_config'] },
  attribution: `
On-chain evidence: Move package with both \`stake\` and \`stake_config\` modules, published from TokenLabs' framework deployer \`0x9bd8…9841\`.

Renamed from the generic "Staking" label after identifying the deployer as TokenLabs. The \`{stake, stake_config, stake_entries}\` module set is the TokenLabs staking primitive other IOTA teams integrate against (see IotaRoyale's TLN farm). Pools Finance's bundled AMM+stake packages contain these modules too but are caught earlier in ALL_PROJECTS by the Pools Finance rule.
`.trim(),
};
