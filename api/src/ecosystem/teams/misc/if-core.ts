import { Team } from '../team.interface';

export const ifCore: Team = {
  id: 'if-core',
  name: 'IOTA Foundation (Chain Primitives)',
  description: 'Owns the IOTA system packages (0x1 Move stdlib, 0x2 framework, 0x3 staking/validator/epoch). These are chain-level primitives, not ecosystem dapps.',
  urls: [{ label: 'IOTA Foundation', href: 'https://www.iota.org' }],
  // System packages have no conventional deployer address.
  deployers: [],
};
