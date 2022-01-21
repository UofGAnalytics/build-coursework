import { Literal, Parent } from 'mdast';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

import { failMessage } from '../utils/message';

interface LeafDirective extends Parent {
  name: string;
  attributes: Record<string, string>;
}

export function assertVideoAttributes() {
  return async (tree: Node, file: VFile) => {
    visit<LeafDirective>(tree, 'leafDirective', (node) => {
      if (node.name === 'video') {
        if (!node.attributes.id) {
          failMessage(file, 'id attribute is required', node.position);
        }
        if (!node.attributes.duration) {
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
