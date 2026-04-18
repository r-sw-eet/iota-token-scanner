import { ProjectDefinition } from '../project.interface';

export const virtue: ProjectDefinition = {
  name: 'Virtue',
  layer: 'L1',
  category: 'Stablecoin / CDP',
  description: 'First native stablecoin (VUSD) protocol on IOTA Rebased. Users mint VUSD (USD-pegged) by locking wIOTA or stIOTA as collateral in Collateralized Debt Positions. Row covers the Framework, VUSD Treasury, Oracle, and CDP components — the Stability Pool has its own row.',
  urls: [
    { label: 'App', href: 'https://virtue.money' },
    { label: 'Docs', href: 'https://docs.virtue.money' },
  ],
  teamId: 'virtue',
  match: {
    packageAddresses: [
      '0x7400af41a9b9d7e4502bc77991dbd1171f90855564fd28afa172a5057beb083b', // Framework
      '0xd3b63e603a78786facf65ff22e79701f3e824881a12fa3268d62a75530fe904f', // VUSD Treasury
      '0x7eebbee92f64ba2912bdbfba1864a362c463879fc5b3eacc735c1dcb255cc2cf', // Oracle
      '0x34fa327ee4bb581d81d85a8c40b6a6b4260630a0ef663acfe6de0e8ca471dd22', // CDP
    ],
  },
  attribution: `
On-chain evidence: four hardcoded package addresses from Virtue's public docs (\`docs.virtue.money/resources/technical-resources\`) — Framework \`0x7400af41a9b9d7e4502bc77991dbd1171f90855564fd28afa172a5057beb083b\`, VUSD Treasury \`0xd3b63e603a78786facf65ff22e79701f3e824881a12fa3268d62a75530fe904f\` (ships the VUSD coin type literally), Oracle \`0x7eebbee92f64ba2912bdbfba1864a362c463879fc5b3eacc735c1dcb255cc2cf\`, CDP \`0x34fa327ee4bb581d81d85a8c40b6a6b4260630a0ef663acfe6de0e8ca471dd22\`.

Previously matched via \`{all: [liquidity_pool, delegates]}\` — that rule actually matched CyberPerp's 19-module GMX fork, not any Virtue package (Virtue doesn't ship a \`liquidity_pool\` module at all; that's DEX/perps vocabulary). Rewritten to the 4 canonical docs-listed addresses; the 5th (Stability Pool) has its own row so stability-pool events stay legible. Rule will not auto-discover upgrades — but Virtue's single deployer is known, and upgrades at new addresses will surface as \`anomalousDeployers\` entries in the scanner log, at which point we extend \`packageAddresses\`.
`.trim(),
};

export const virtueStabilityPool: ProjectDefinition = {
  name: 'Virtue Stability Pool',
  layer: 'L1',
  category: 'Stability Pool',
  description: 'Stability-pool primitive for the Virtue CDP system. Depositors provide VUSD to absorb liquidations and earn collateral rewards; the balance_number module maintains the internal ledger of depositor shares across the protocol.',
  urls: [{ label: 'App', href: 'https://virtue.money' }],
  teamId: 'virtue',
  logo: '/logos/virtue.svg',
  match: { all: ['balance_number', 'stability_pool'] },
  attribution: `
On-chain evidence: Move package with both \`balance_number\` and \`stability_pool\` modules. This is the 5th Virtue canonical component (Stability Pool at \`0xc7ab9b9353e23c6a3a15181eb51bf7145ddeff1a5642280394cd4d6a0d37d83b\` per the Virtue docs), kept as its own row so stability-pool events (deposits, liquidations, reward claims) don't get lumped with the other 4 core components.

Previously named "Virtue Pool" — renamed because the module pair unambiguously identifies Virtue's Stability Pool primitive. The old "Virtue Stability" def (matching \`{stability_pool, borrow_incentive}\`) matched zero packages on mainnet and was dropped: Virtue's incentive packages ship \`stability_pool_incentive\`, not \`stability_pool\`.
`.trim(),
};
