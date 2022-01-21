import { Node } from 'hast';
import { Heading } from 'mdast';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

import { failMessage } from '../utils/message';

export function assertNoH1() {
  return (tree: Node, file: VFile) => {
    visit<Heading>(tree, 'heading', (node) => {
      if (node.depth === 1) {
        failMessage(
          file,
          'Level 1 heading found. Only one Level 1 heading can be used in the document and it is automatically generated from .yaml file and should not be found in .Rmd file.  Please use Level 2 (## Example) and below.',
          node.position
        );
        return;
      }
    });
  };
}
