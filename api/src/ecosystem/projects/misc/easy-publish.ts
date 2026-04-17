import { ProjectDefinition } from '../project.interface';

export const easyPublish: ProjectDefinition = {
  name: 'Easy Publish',
  layer: 'L1',
  category: 'Tooling',
  description: 'Simplified Move package publishing tool for IOTA Rebased. Lowers the barrier for developers to deploy smart contracts by abstracting the publish transaction flow.',
  urls: [],
  teamId: 'easy-publish',
  match: { all: ['easy_publish'] },
  attribution: `
On-chain evidence: Move package with module \`easy_publish\`.

Developer-tooling package that abstracts the Move-package publish flow. "Easy Publish" is the literal module name and also how it's referred to by its deployer. Single known deployer.
`.trim(),
};
