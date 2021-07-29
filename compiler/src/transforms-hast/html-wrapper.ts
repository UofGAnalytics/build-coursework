import { Node, Parent } from 'unist';

import { UnitTitles } from '../course/types';
import { createMain } from '../html-wrapper/main';
import { createSidebar } from '../html-wrapper/sidebar';
import { createDefs, createSvg } from '../utils/icons';

export function htmlWrapper(titles: UnitTitles, mdast: Node) {
  return async (tree: Node) => {
    const hamburgerIcon = createSvg('hamburger-icon');
    const sidebar = await createSidebar(mdast);
    const main = await createMain(titles, (tree as Parent).children);
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
