import { Node, Parent } from 'unist';

// import { UnitTitles } from '../course/types';
import { createDefs } from '../utils/icons';
import { createMain } from './wrapper/main';

export function pdfWrapper() {
  return async (tree: Node) => {
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
            className: ['hide-sidebar', 'font-default'],
          },
          children: [iconDefs, main],
        },
      ],
    };
  };
}
