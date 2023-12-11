import { List, Nodes, Parent } from 'mdast';
import { toHast } from 'mdast-util-to-hast';
import { toc as getToc } from 'mdast-util-toc';

import crestSvg from '../../../assets/crest.svg';
import uOfGSvg from '../../../assets/uofg.svg';
import { getAssetHast } from '../../utils/get-asset-hast';
import { createSvg } from '../../utils/icons';
import {
  createViewOptions,
  createViewOptionsButton,
} from './view-options';

export async function createSidebar(mdast: Parent) {
  const logo = await createLogo();
  const toc = getToc(mdast as Nodes, { maxDepth: 3 }).map;
  const tocChildren = toc === undefined ? [] : [toHast(toc)];

  printTableOfContents(toc);

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

function printTableOfContents(toc: List | undefined) {
  // toc?.children.forEach((a) => {
  //   a.children.forEach((b) => {
  //     if (b.type === 'paragraph') {
  //       // @ts-ignore
  //       console.log(`- [ ] ${b.children[0].children[0].value}`);
  //     }
  //     if (b.type === 'list') {
  //       b.children.forEach((c) => {
  //         c.children.forEach((d) => {
  //           if (d.type === 'paragraph') {
  //             // @ts-ignore
  //             console.log(`  - [ ] ${d.children[0].children[0].value}`);
  //           }
  //         });
  //       });
  //     }
  //   });
  // });
}
