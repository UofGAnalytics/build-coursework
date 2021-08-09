import { Node, Parent } from 'unist';

import { createDefs, createSvg } from '../../utils/icons';
import { createMain } from './main';
import { createSidebar } from './sidebar';

export function htmlWrapper(mdast: Node) {
  return async (tree: Node) => {
    const hamburgerIcon = createSvg('hamburger-icon');
    const sidebar = await createSidebar(mdast);
    const main = await createMain((tree as Parent).children);
    const iconDefs = createDefs();
    return {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'div',
          properties: {
            id: 'root',
          },
          children: [iconDefs, hamburgerIcon, sidebar, main],
        },
      ],
    };
  };
}
