import { Node } from 'hast';
import { VFile } from 'vfile';
import visit from 'unist-util-visit';
import { failMessage } from '../message';

export function assertTaskAnswerStructure() {
  // TODO: switch to VFile reporting
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

export function moveAnswersToEnd() {
  return (tree: Node) => {
    visit(tree, 'containerDirective', (node, index, parent) => {
      if (node.name === 'answer') {
        // these nodes have already been moved to the end
        if (node.data?.movedToEnd) {
          return;
        }

        // remove answer block from task node
        const parentChildren = parent?.children || [];
        parentChildren.splice(index, 1);

        // add to root node
        const treeChildren = (tree.children || []) as Node[];
        node.data = { movedToEnd: true };
        treeChildren.push(node);
      }
    });
  };
}
