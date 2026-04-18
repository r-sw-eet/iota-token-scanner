import { Team } from '../team.interface';

export const liquidlink: Team = {
  id: 'liquidlink',
  name: 'LiquidLink',
  description: 'Incentive / social infrastructure tracking engagement and loyalty across the IOTA ecosystem. Ships an IOTA-specific subdomain (iota.liquidlink.io) alongside the multi-chain product.',
  urls: [
    { label: 'Website', href: 'https://www.liquidlink.io' },
    { label: 'IOTA app', href: 'https://iota.liquidlink.io' },
  ],
  deployers: ['0xd6a54ff7f851b58c19729c11d210d46fd46d702b9d9caff78747de1914c934ee'],
  attribution: `
Previously registered as "Points System" — a descriptor based on the \`{constant, event, point, profile}\` module signature. Verified as LiquidLink via the IOTA-subdomain at \`iota.liquidlink.io\`, which is the product's IOTA-native front door and calls into this deployer's packages. The main product (liquidlink.io) is multi-chain; IOTA is one deployment. Single deployer publishes all 11 LiquidLink packages (core + 2 refactored v2 packages with \`{core, events}\` modules + utility + profile-with-like variants).
`.trim(),
};
