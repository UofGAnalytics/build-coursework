import toHast from 'mdast-util-to-hast';
import { Node } from 'unist';
import visit from 'unist-util-visit';
import { VFile } from 'vfile';

export function responsiveTables() {
  return async (tree: Node, file: VFile) => {
    visit(tree, 'table', (node) => {
      node.data = {
        hName: 'div',
        hProperties: {
          className: 'table-wrapper',
        },
        hChildren: [toHast(node)],
      };
    });
  };
}
