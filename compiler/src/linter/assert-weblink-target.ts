import { Node } from 'hast';
import { Parent } from 'mdast';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

import { failMessage } from '../utils/message';

interface ContainerDirective extends Parent {
  name: string;
  attributes: Record<string, string>;
}

export function assertWeblinkTarget() {
  return (tree: Node, file: VFile) => {
    visit<ContainerDirective>(tree, 'containerDirective', (node) => {
      if (node.name === 'weblink') {
        if (node.attributes.target === undefined) {
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
