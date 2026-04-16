import { ProjectDefinition } from '../project.interface';

export const nativeStaking: ProjectDefinition = {
  name: 'Native Staking',
  layer: 'L1',
  category: 'Chain Primitive',
  description: 'Protocol-level staking, validator management, and epoch transitions on the IOTA system package (0x3). Every user who delegates IOTA to a validator (via Firefly or any wallet) interacts with these modules. Includes timelocked staking used for Stardust migration unlocks.',
  urls: [{ label: 'IOTA Foundation', href: 'https://www.iota.org' }],
  disclaimer: 'Chain primitive, not an ecosystem dapp. Represents native staking activity across the IOTA Foundation system package.',
  teamId: 'if-core',
  match: {
    packageAddresses: [
      '0x0000000000000000000000000000000000000000000000000000000000000003',
    ],
  },
};
