import { Literal, Parent } from 'mdast';
import { Root } from 'mdast';
import { LeafDirective } from 'mdast-util-directive';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

import { failMessage } from '../utils/message';

export function assertVideoAttributes() {
  return async (tree: Root, file: VFile) => {
    visit(tree, 'leafDirective', (node: LeafDirective) => {
      if (node.name === 'video') {
        if (!node.attributes?.id) {
          failMessage(file, 'id attribute is required', node.position);
        }
        if (!node.attributes?.duration) {
          failMessage(
            file,
            'duration attribute is required',
            node.position
          );
        }

        const title = getTitle(node);
        if (!title) {
          failMessage(file, 'title is required', node.position);
        }
      }
    });
  };
}

function getTitle(node: Parent) {
  const children = node.children as Node[];
  const firstChild = children[0] as Literal;
  return (firstChild?.value || '') as string;
}
