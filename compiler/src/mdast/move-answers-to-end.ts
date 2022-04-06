import { Node, Parent } from 'hast';
import { ContainerDirective } from 'mdast-util-directive';
import { visit } from 'unist-util-visit';

export function moveAnswersToEnd() {
  return (tree: Node) => {
    visit(
      tree,
      'containerDirective',
      (node: ContainerDirective, _index, _parent) => {
        const index = _index as number;
        const parent = _parent as Parent;

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
          if (node.attributes?.movedToEnd === 'yes') {
            return;
          }

          // remove answer block from task node
          const parentChildren = parent?.children || [];
          parentChildren.splice(index || 0, 1);

          // add to root node
          const treeParent = tree as Parent;
          const treeChildren = (treeParent.children || []) as Node[];

          node.attributes = {
            ...(node.attributes || {}),
            movedToEnd: 'yes',
          };

          treeChildren.push(node);
        }
      }
    );
  };
}
