import { Node } from 'hast';
import visit from 'unist-util-visit';
import { VFile } from 'vfile';

import { failMessage } from '../utils/message';

export function assertWeblinkTarget() {
  return (tree: Node, file: VFile) => {
    visit(tree, 'containerDirective', (node) => {
      if (node.name === 'weblink') {
        const { target } = node.attributes as Record<string, string>;
        if (target === undefined) {
          failMessage(
            file,
            'Weblink has no target attribute',
            node.position
          );
        }
      }
    });
  };
}
