export interface Team {
  /** Stable slug, e.g. 'iota-foundation-identity'. Referenced by ProjectDefinition.teamId. */
  id: string;
  /** Human-readable name shown on the website. */
  name: string;
  description?: string;
  urls?: { label: string; href: string }[];
  /** Mainnet addresses known to publish packages for this team (lowercased on compare). */
  deployers: string[];
  /** Absolute public path to the team ICON (square — e.g. `/logos/virtue.svg`). Used on list rows, team cards, and any small-size rendering. Inherited by every project on this team unless the project overrides via `ProjectDefinition.logo`. */
  logo?: string;
  /** Optional landscape WORDMARK (icon + brand text, e.g. `/logos/virtue-wordmark.svg`). Used on project-details pages where horizontal space allows the full brand mark; falls back to `logo` when absent. */
  logoWordmark?: string;
  /**
   * Free-form prose explaining how we established this deployer-to-team
   * mapping — what off-chain signals (website, docs, social, observed app
   * behavior, shared deployer with a known team, etc.) confirmed the
   * identity. Surfaced on the project details page; not shown elsewhere.
   */
  attribution?: string;
}
