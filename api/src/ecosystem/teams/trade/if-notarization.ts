import { Team } from '../team.interface';

export const ifNotarization: Team = {
  id: 'if-notarization',
  name: 'IOTA Foundation (Notarization)',
  description: 'IOTA Foundation dynamic notarization contracts.',
  urls: [{ label: 'IOTA Foundation', href: 'https://www.iota.org' }],
  deployers: [
    '0x56afb2eded3fb2cdb73f63f31d0d979c1527804144eb682c142eb93d43786c8f',
    '0xedb0c77b6393a11b4c29b7914410e468680e3bc8110e99a40c203038c9335fc2',
  ],
};
