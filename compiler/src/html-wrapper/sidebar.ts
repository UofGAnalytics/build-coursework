import toHast from 'mdast-util-to-hast';
import getToc from 'mdast-util-toc';
import { Node } from 'unist';

import { getAssetHast } from '../utils/get-asset-hast';
import { createSvg } from '../utils/icons';
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
  const hamburgerIcon = await createSvg('hamburger-icon');
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
      hamburgerIcon,
    ],
  };
}
