import { Root } from 'mdast';
import { ContainerDirective } from 'mdast-util-directive';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

import { failMessage } from '../utils/message';

export function assertColumnStructure() {
  return (tree: Root, file: VFile) => {
    visit(
      tree,
      'containerDirective',
      (node: ContainerDirective, index, _parent) => {
        if (node.name === 'columns') {
          const children = node.children as ContainerDirective[];
          const columns = children.filter((o) => o.name === 'column');
          if (columns.length < 2) {
            failMessage(
              file,
              'Columns must contain at least 2 columns',
              node.position
            );
          }
        }
        if (node.name === 'column') {
          const parent = _parent as ContainerDirective;
          if (!parent || parent.name !== 'columns') {
            failMessage(
              file,
              'Column must be nested inside columns',
              node.position
            );
          }
        }
      }
    );
  };
}
