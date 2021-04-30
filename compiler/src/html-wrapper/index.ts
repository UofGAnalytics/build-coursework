import { Node } from 'unist';

import { UnitTitles } from '../course/types';
import { createMain } from './main';
import { createSidebar } from './sidebar';

export function htmlWrapper(titles: UnitTitles, mdast: Node) {
  return async (tree: Node) => {
    const sidebar = await createSidebar(mdast);
    const children = tree.children as Node[];
    const main = await createMain(titles, children);
    return {
      type: 'root',
      children: [sidebar, main],
    };
  };
}
