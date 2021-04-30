import toHast from 'mdast-util-to-hast';
import getToc from 'mdast-util-toc';
// @ts-expect-error
import toVFile from 'to-vfile';
import { Node, Parent } from 'unist';
import { VFile } from 'vfile';

import { getAsset } from '../env';
import { rehypeParser } from '../utils/utils';
import { createViewOptions, createViewOptionsButton } from './view-options';

export async function createSidebar(mdast: Node) {
  const logo = await createLogo();
  const toc = getToc(mdast, { maxDepth: 3 }).map as Node;

  return {
    type: 'element',
    tagName: 'aside',
    children: [
      logo,
      createViewOptionsButton(),
      {
        type: 'element',
        tagName: 'nav',
        properties: {
          id: 'toc',
        },
        children: [toHast(toc)],
      },
      {
        type: 'element',
        tagName: 'div',
        properties: {
          id: 'view-options',
        },
        children: createViewOptions(),
      },
    ],
  };
}

async function createLogo() {
  const crest = await getAssetHast('crest.svg');
  const uofg = await getAssetHast('uofg.svg');
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: 'logo',
    },
    children: [
      {
        type: 'element',
        tagName: 'div',
        properties: {
          className: 'logo-wrapper',
        },
        children: [crest, uofg],
      },
    ],
  };
}

async function getAssetHast(name: string) {
  const contents = await getAsset(name);
  const vfile = toVFile({ contents }) as VFile;
  const parsed = rehypeParser().parse(vfile) as Parent;
  return parsed.children[0];
}
