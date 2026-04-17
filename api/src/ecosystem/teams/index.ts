import { Team } from './team.interface';

import { poolsFinance, virtue, swirl } from './defi/_index';
import { ifTlip, salus } from './trade/_index';
import { oid } from './identity/_index';
import { ibtc, layerzero, wormholeFoundation } from './bridges/_index';
import { switchboard } from './oracles/_index';
import { tradeport } from './nft/_index';
import { gambling } from './games/_index';
import { ifTesting, iotaFoundation, studioB8b1, studio0a0d, easyPublish, pointsSystem, boltProtocol, stakingGeneric } from './misc/_index';

/**
 * Team registry. Every project references exactly one team via `teamId`.
 *
 * A team groups:
 * - a real-world entity (IOTA Foundation, Virtue, Salus, …) OR an anonymous
 *   but observably-distinct developer (identified only by deployer address)
 * - one or more mainnet addresses that publish its packages
 * - one or more projects in the scanner
 *
 * Aggregate projects (NFT Collections, LayerZero OFT) have `teamId: null`
 * because they represent unrelated third-party deployments.
 */
export const ALL_TEAMS: Team[] = [
  // DeFi
  poolsFinance,
  virtue,
  swirl,

  // Trade
  ifTlip, salus,

  // Identity
  oid,

  // Bridges
  ibtc, layerzero, wormholeFoundation,

  // Oracles
  switchboard,

  // NFT
  tradeport,

  // Games
  gambling,

  // IOTA Foundation (consolidated: chain primitives + Identity + Notarization + Traceability)
  iotaFoundation,

  // Misc — IF testing (kept separate for NFT-bucket routing), anonymous studios, single-project teams
  ifTesting,
  studioB8b1, studio0a0d,
  easyPublish, pointsSystem, boltProtocol, stakingGeneric,
];

/** Look up a team by its id. Returns undefined if not found. */
export function getTeam(id: string | null | undefined): Team | undefined {
  if (!id) return undefined;
  return ALL_TEAMS.find((t) => t.id === id);
}

/** Find the team that claims the given deployer address (lowercased compare). */
export function getTeamByDeployer(address: string): Team | undefined {
  const lower = address.toLowerCase();
  return ALL_TEAMS.find((t) => t.deployers.some((d) => d.toLowerCase() === lower));
}

export { Team };
