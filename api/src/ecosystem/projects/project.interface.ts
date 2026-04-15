export interface ProjectDefinition {
  name: string;
  layer: 'L1' | 'L2';
  category: string;
  /** 50-500 characters describing what the project does */
  description: string;
  /** One or more URLs (website, docs, app, etc.) */
  urls: { label: string; href: string }[];
  /** Path to logo file relative to the project's folder, e.g. './logo.svg' */
  logo?: string;
  /** Module names that uniquely identify this project's packages */
  match: {
    all?: string[];
    any?: string[];
    exact?: string[];
    minModules?: number;
  };
}
