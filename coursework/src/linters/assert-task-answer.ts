import { Node } from 'hast';
import visit from 'unist-util-visit';
import { VFile } from 'vfile';

import { failMessage } from '../utils/message';

export function assertTaskAnswerStructure() {
  return (tree: Node, file: VFile) => {
    visit(tree, 'containerDirective', (node, index, parent) => {
      if (node.name === 'task') {
        const children = (node.children || []) as Node[];
        const answers = children.filter((o) => o.name === 'answer');
        if (answers.length < 1) {
          failMessage(file, 'Task has no answer', node.position);
        }
        if (answers.length > 1) {
          failMessage(file, 'Task has multiple answers', node.position);
        }
      }
      if (node.name === 'answer') {
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
