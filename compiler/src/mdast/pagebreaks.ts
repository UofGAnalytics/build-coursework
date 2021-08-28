import { Node, Parent } from 'unist';
import visit from 'unist-util-visit';

interface LeafDirective extends Parent {
  name: string;
  attributes: Record<string, string>;
}

export function pagebreaks() {
  return async (tree: Node) => {
    visit<LeafDirective>(tree, 'leafDirective', (node) => {
      if (node.name === 'pagebreak') {
        node.data = {
          hName: 'hr',
          hProperties: {
            className: 'pagebreak',
          },
        };
      }
    });
  };
}
