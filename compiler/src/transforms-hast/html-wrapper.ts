import { Node } from 'unist';

import { UnitTitles } from '../course/types';
import { createMain } from '../html-wrapper/main';
import { createSidebar } from '../html-wrapper/sidebar';
import { createDefs, createSvg } from '../utils/icons';

export function htmlWrapper(titles: UnitTitles, mdast: Node) {
  return async (tree: Node) => {
    const hamburgerIcon = await createSvg('hamburger-icon');
    const sidebar = await createSidebar(mdast);
    const children = tree.children as Node[];
    const main = await createMain(titles, children);
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
