import { Team } from '../team.interface';

export const stakingGeneric: Team = {
  id: 'staking-generic',
  name: 'Staking (generic)',
  deployers: ['0x9bd84e617831511634d8aca9120e90b07ba9e4fd920029e1fe4c887fc8599841'],
  attribution: `
Catch-all team for a generic configurable-staking contract. The deployer isn't tied to a recognized team name; we label it "Staking (generic)" until we identify it. If the deployer turns out to belong to a known team, this entry should be reassigned and this team entry removed.
`.trim(),
};
