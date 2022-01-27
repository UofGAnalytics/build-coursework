import { Element } from 'hast';
import cloneDeep from 'lodash/cloneDeep.js';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

type ParentProps = {
  className: string[];
};

export function responsiveTables() {
  return async (tree: Element, file: VFile) => {
    visit(tree, 'element', (node, idx, _parent) => {
      if (node.tagName !== 'table') {
        return;
      }

      const parent = _parent as Element;
      const properties = (parent?.properties || {}) as ParentProps;
      const className = properties.className || [];

      if (!className.includes('table-wrapper')) {
        Object.assign(node, {
          tagName: 'div',
          properties: {
            className: 'table-wrapper',
          },
          children: [cloneDeep(node)],
        });
      }
    });
  };
}
