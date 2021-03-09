import { Node } from 'hast';
import visit from 'unist-util-visit';

export function assertTaskAnswerStructure() {
  // TODO: switch to VFile reporting
  return (tree: Node) => {
    visit(tree, 'containerDirective', (node, index, parent) => {
      if (node.name === 'task') {
        const children = (node.children || []) as Node[];
        const answers = children.filter((o) => o.name === 'answer');
        if (answers.length < 1) {
          throw new Error('Task has no answer');
        }
        if (answers.length > 1) {
          throw new Error('Task has multiple answers');
        }
      }
      if (node.name === 'answer') {
        if (!parent || parent.name !== 'task') {
          throw new Error('Answer must be nested inside task');
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
    return tree;
  };
}
