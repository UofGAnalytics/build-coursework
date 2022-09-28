import { Root } from 'mdast';
import { ContainerDirective } from 'mdast-util-directive';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

import { failMessage } from '../utils/message';

export function assertProgramSwitcherStructure() {
  return (tree: Root, file: VFile) => {
    let count = 0;
    visit(tree, 'containerDirective', (node, index, _parent) => {
      if (node.name === 'task') {
        count++;
        const children = node.children as ContainerDirective[];
        const answers = children.filter((o) => o.name === 'answer');
        if (answers.length < 1) {
          failMessage(file, `Task ${count} has no answer`, node.position);
        }
        if (answers.length > 1) {
          failMessage(file, 'Task has multiple answers', node.position);
        }
      }
      if (node.name === 'answer') {
        const parent = _parent as ContainerDirective;
        if (!parent || parent.name !== 'task') {
          failMessage(
            file,
            'Answer must be nested inside task',
            node.position
          );
        }
      }
    });
  };
}
