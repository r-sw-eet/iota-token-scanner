import { ProjectDefinition } from '../project.interface';

export const izipublish: ProjectDefinition = {
  name: 'izipublish',
  layer: 'L1',
  category: 'Data / Publishing',
  description: 'Data-publishing framework on IOTA Rebased. Publishers notarize structured datasets on-chain and distribute them to subscribers. Not a Move-package publisher — the easy_publish module name predates the product rename and refers to dataset publication, not package deployment.',
  urls: [{ label: 'Website', href: 'https://izipublish.com' }],
  teamId: 'izipublish',
  match: { all: ['easy_publish'] },
  attribution: `
On-chain evidence: Move package with module \`easy_publish\` (legacy module name kept for compatibility across upgrade versions — the surfaced product is izipublish).

Previously mislabeled as "Easy Publish / Simplified Move package publishing tool" — that description was factually wrong. izipublish.com is a data-publishing framework: publishers anchor structured datasets on-chain via the \`easy_publish\` primitive, and subscribers/consumers read from the registry. Two deployer keys on the team: the core-package deployer (\`0x0dce…db97\`) and the publisher/subscriber account (\`0x7c33…0af429\`) that anchors dataset releases.
`.trim(),
};
