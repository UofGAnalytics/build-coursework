import { Paragraph } from 'mdast';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';

export function removeEmptyParagraphs() {
  return async (tree: Node) => {
    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      if (node.children.length === 0) {
        const parentChildren = parent?.children || [];
        parentChildren.splice(index || 0, 1);
      }
    });
  };
}
