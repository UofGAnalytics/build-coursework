import { Root } from 'mdast';
import { ContainerDirective } from 'mdast-util-directive';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

import { failMessage } from '../utils/message';

export function assertWeblinkTarget() {
  return (tree: Root, file: VFile) => {
    visit(tree, 'containerDirective', (node: ContainerDirective) => {
      if (node.name === 'weblink') {
        if (node.attributes?.target === undefined) {
          failMessage(
            file,
            'Weblink has no target attribute',
            node.position,
          );
        }
      }
    });
  };
}
