export interface Team {
  /** Stable slug, e.g. 'iota-foundation-identity'. Referenced by ProjectDefinition.teamId. */
  id: string;
  /** Human-readable name shown on the website. */
  name: string;
  description?: string;
  urls?: { label: string; href: string }[];
  /** Mainnet addresses known to publish packages for this team (lowercased on compare). */
  deployers: string[];
  /** Absolute public path to the team logo (e.g. `/logos/virtue.svg`). Inherited by every project on this team unless the project overrides via `ProjectDefinition.logo`. */
  logo?: string;
  /**
   * Free-form prose explaining how we established this deployer-to-team
   * mapping — what off-chain signals (website, docs, social, observed app
   * behavior, shared deployer with a known team, etc.) confirmed the
   * identity. Surfaced on the project details page; not shown elsewhere.
   */
  attribution?: string;
}
