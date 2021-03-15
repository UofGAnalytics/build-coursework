import toHast from 'mdast-util-to-hast';
import { Node } from 'unist';
import visit from 'unist-util-visit';

export function boxouts() {
  return async (tree: Node) => {
    visit(tree, 'containerDirective', (node) => {
      switch (node.name) {
        case 'example':
        case 'supplement':
        case 'background':
        case 'weblink':
        case 'task':
          template(node);
      }
    });
  };
}

function template(node: Node) {
  const name = node.name as string;
  const children = node.children as Node[];
  const newChildren: Node[] = [];

  const child = children[0] || {};
  if (child.type === 'paragraph' && child.data?.directiveLabel) {
    const label = children.shift() as Node;
    newChildren.push({
      type: 'element',
      tagName: 'h3',
      children: label.children,
    });
  }

  newChildren.push(
    ...children
      .filter((o) => o.name !== 'answer') // TODO: move this to task-answer
      .map((child) => toHast(child))
  );

  const data = {
    hName: 'div',
    hProperties: {
      className: ['boxout', name],
    },
    hChildren: newChildren,
  };

  const attributes = node.attributes as Record<string, string>;
  if (attributes.icon) {
    data.hProperties.className.push(`${attributes.icon}-icon`);
  }

  node.data = data;
}
