import { Root } from 'mdast';
import { toHast } from 'mdast-util-to-hast';
import { toc as getToc } from 'mdast-util-toc';
import { Node } from 'unist';

import crestSvg from '../../../assets/crest.svg';
import uOfGSvg from '../../../assets/uofg.svg';
import { getAssetHast } from '../../utils/get-asset-hast';
import { createSvg } from '../../utils/icons';
import {
  createViewOptions,
  createViewOptionsButton,
} from './view-options';

export async function createSidebar(mdast: Node) {
  const logo = await createLogo();
  const toc = getToc(mdast as Root, { maxDepth: 3 }).map;
  const tocChildren = toc === null ? [] : [toHast(toc)];

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
        children: tocChildren,
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
  const crest = getAssetHast(crestSvg);
  const uofg = getAssetHast(uOfGSvg);
  const hamburgerIcon = createSvg('hamburger-icon');
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
