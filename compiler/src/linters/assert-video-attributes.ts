import { Node } from 'unist';
import visit from 'unist-util-visit';
import { VFile } from 'vfile';

import { failMessage } from '../utils/message';

export function assertVideoAttributes() {
  return async (tree: Node, file: VFile) => {
    visit(tree, 'leafDirective', (node) => {
      if (node.name === 'video') {
        const attributes = node.attributes as Record<string, string>;
        if (!attributes.id) {
          failMessage(file, 'id attribute is required', node.position);
        }
        if (!attributes.duration) {
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

function getTitle(node: Node) {
  const children = node.children as Node[];
  const firstChild = children[0];
  return firstChild.value as string;
}
