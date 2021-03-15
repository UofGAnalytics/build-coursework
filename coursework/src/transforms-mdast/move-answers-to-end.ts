import { Node } from 'hast';
import visit from 'unist-util-visit';

export function moveAnswersToEnd() {
  return (tree: Node) => {
    visit(tree, 'containerDirective', (node, index, parent) => {
      if (node.name === 'answer') {
        // these nodes have already been moved to the end
        if (node.movedToEnd) {
          return;
        }

        // remove answer block from task node
        const parentChildren = parent?.children || [];
        parentChildren.splice(index, 1);

        // add to root node
        const treeChildren = (tree.children || []) as Node[];
        node.movedToEnd = true;
        treeChildren.push(node);
      }
    });
  };
}
