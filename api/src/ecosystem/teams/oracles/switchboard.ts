import { Team } from '../team.interface';

export const switchboard: Team = {
  id: 'switchboard',
  name: 'Switchboard',
  description: 'Switchboard oracle network on IOTA.',
  urls: [{ label: 'Website', href: 'https://switchboard.xyz' }],
  deployers: ['0x55f1256ec64d7c4eacb1a5e24932b9face3cdf9400f8d828001b2da0494e7404'],
  attribution: `
Deployer \`0x55f1…7404\` is Switchboard's oracle deployer on IOTA, cross-checked against Switchboard's public deployment info at switchboard.xyz. The package signature (aggregator-based oracle with 10+ modules) matches Switchboard's architecture elsewhere.
`.trim(),
};
