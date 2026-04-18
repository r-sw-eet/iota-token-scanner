import { Team } from '../team.interface';

export const tokenlabs: Team = {
  id: 'tokenlabs',
  name: 'TokenLabs',
  description: 'Multi-product DeFi team. Ships a staking framework (used by other IOTA projects), a liquid-staking protocol (vIOTA — IOTA\'s second LST alongside Swirl), the TLN governance/utility token, and a simple payment primitive.',
  urls: [
    { label: 'Website', href: 'https://tokenlabs.network' },
    { label: 'Twitter/X', href: 'https://x.com/TokenLabsX' },
  ],
  deployers: [
    '0x9bd84e617831511634d8aca9120e90b07ba9e4fd920029e1fe4c887fc8599841',
    '0x5555679093281ffa85c51c24b55fc45ff0f1bb6a57c0bee2c61eae3d5b54ae7c',
  ],
  attribution: `
Previously registered as "Staking (generic)" based on the \`{stake, stake_config}\` module signature alone. Identified as TokenLabs via on-chain + social: the deployer publishes the staking framework that other IOTA projects (e.g. IotaRoyale's TLN farm) integrate against. The second deployer (\`0x5555…\`) is the admin/operator key for the TokenLabs product line: it publishes the vIOTA liquid-staking v1+v2 packages, the \`tln_token\` module (TLN = TokenLabs Network), and a \`simple_payment\` utility. TokenLabs' vIOTA makes IOTA's liquid-staking landscape two-protocol (Swirl + TokenLabs); previously only Swirl was surfaced.
`.trim(),
};
