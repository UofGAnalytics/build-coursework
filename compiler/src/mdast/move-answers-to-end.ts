import { Node, Parent } from 'hast';
import visit from 'unist-util-visit';

interface ContainerDirective extends Parent {
  name: string;
  movedToEnd?: boolean;
}

export function moveAnswersToEnd() {
  return (tree: Node) => {
    visit<ContainerDirective>(
      tree,
      'containerDirective',
      (node, index, parent) => {
        // remove answer from task rehype
        if (node.name === 'task' && node.data) {
          const children = (node.data.hChildren ||
            []) as ContainerDirective[];
          node.data.hChildren = children.filter(
            (o) => o.name !== 'answer'
          );
        }

        if (node.name === 'answer') {
          // these nodes have already been moved to the end
          if (node.movedToEnd) {
            return;
          }

          // remove answer block from task node
          const parentChildren = parent?.children || [];
          parentChildren.splice(index, 1);

          // add to root node
          const treeParent = tree as Parent;
          const treeChildren = (treeParent.children || []) as Node[];
          node.movedToEnd = true;
          treeChildren.push(node);
        }
      }
    );
  };
}
