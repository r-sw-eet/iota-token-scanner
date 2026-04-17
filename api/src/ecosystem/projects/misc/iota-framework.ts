import { ProjectDefinition } from '../project.interface';

export const iotaFramework: ProjectDefinition = {
  name: 'IOTA Framework',
  layer: 'L1',
  category: 'Chain Primitive',
  description: 'Core framework package (0x2) powering kiosk trades, display updates, coin operations, transfer policies, and object management on IOTA Rebased. Every on-chain action that touches coins, NFTs, or shared objects routes through these modules.',
  urls: [{ label: 'IOTA Foundation', href: 'https://www.iota.org' }],
  disclaimer: 'Chain primitive, not an ecosystem dapp. Represents framework-level activity across the IOTA Foundation system package.',
  teamId: 'if-core',
  match: {
    packageAddresses: [
      '0x0000000000000000000000000000000000000000000000000000000000000002',
    ],
  },
};
