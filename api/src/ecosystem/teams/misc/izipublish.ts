import { Team } from '../team.interface';

export const izipublish: Team = {
  id: 'izipublish',
  name: 'izipublish',
  description: 'Data-publishing framework for structured, verifiable on-chain datasets. Not a Move-package publisher — it\'s a product for notarizing and distributing data sets to subscribers.',
  urls: [{ label: 'Website', href: 'https://izipublish.com' }],
  deployers: [
    '0x0dce85b04ae7d67de5c6785f329aac1c429cd9321724d64ba5961d347575db97',
    '0x7c33d09bdaeba8c7ad0fe18e7eb5b3ea4bfd63d2fe1d0ad1eebedce04a0af429',
  ],
  attribution: `
Team operates the izipublish data-publishing framework at izipublish.com. Two deployer keys: \`0x0dce…db97\` publishes the core \`easy_publish\` Move package (the module name is internal legacy — the product is called izipublish); \`0x7c33…0af429\` is the publisher/subscriber account that anchors dataset releases. Previously mis-labeled "Easy Publish" in the registry based on the module name alone.
`.trim(),
};
