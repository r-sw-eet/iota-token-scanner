export interface Team {
  /** Stable slug, e.g. 'iota-foundation-identity'. Referenced by ProjectDefinition.teamId. */
  id: string;
  /** Human-readable name shown on the website. */
  name: string;
  description?: string;
  urls?: { label: string; href: string }[];
  /** Mainnet addresses known to publish packages for this team (lowercased on compare). */
  deployers: string[];
  /**
   * Marks this team as **IOTA Foundation proper** — IF's own product lines
   * and internal operations, not IF-partnered or IF-co-founded entities.
   * Used by the website's "Hide IOTA Foundation" filter.
   *
   * True for:
   *   - `iota-foundation` (consolidated: Identity / Notarization / Traceability
   *     / Asset Framework / Accreditation / chain primitives)
   *   - `if-testing` (IF's own internal test deployments — NFT tag vocabulary
   *     `gas_station_*` / `transfer_test` / `regular_comparison` confirms it)
   *
   * False / unset for:
   *   - `tlip` (IF × TradeMark East Africa partnership — distinct brand,
   *     separate wiki, separate GitHub org)
   *   - `twin-foundation` (IF-co-founded Swiss parent foundation — separate
   *     legal entity, own governance, own product surface)
   */
  isIotaFoundationFamily?: boolean;
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
