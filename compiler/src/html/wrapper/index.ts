import { Parent } from 'mdast';

import { Context } from '../../context';
import { Unit } from '../../course/types';
import { createDefs, createSvg } from '../../utils/icons';
import { createMain } from './main';
import { createSidebar } from './sidebar';

export function htmlWrapper(unit: Unit, mdast: Parent, ctx: Context) {
  return async (tree: Parent) => {
    const hamburgerIcon = createSvg('hamburger-icon');
    const sidebar = await createSidebar(mdast);
    const main = await createMain(unit.titles, ctx.course, tree.children);
    const iconDefs = createDefs();
    return {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'div',
          properties: {
            id: 'root',
            className: ['hide-sidebar'],
          },
          children: [iconDefs, main, hamburgerIcon, sidebar],
        },
      ],
    };
  };
}
