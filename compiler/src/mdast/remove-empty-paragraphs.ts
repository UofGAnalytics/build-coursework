import { Paragraph, Parent } from 'mdast';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';

export function removeEmptyParagraphs() {
  return async (tree: Node) => {
    visit(tree, 'paragraph', (node: Paragraph, _index, _parent) => {
      const index = _index as number;
      const parent = _parent as Parent;

      if (node.children.length === 0) {
        const parentChildren = parent?.children || [];
        parentChildren.splice(index || 0, 1);
      }
    });
  };
}
