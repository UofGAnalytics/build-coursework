import { Node } from 'unist';
import visit from 'unist-util-visit';
import toHast from 'mdast-util-to-hast';

export function boxout() {
  return async (tree: Node) => {
    const transformations: Promise<void>[] = [];

    visit(tree, 'containerDirective', (node) => {
      switch (node.name) {
        case 'example':
        case 'supplement':
        case 'background':
        case 'weblink':
        case 'task':
          transformations.push(template(node));
          break;
      }
    });

    await Promise.all(transformations);
    return tree;
  };
}

async function template(node: Node) {
  const name = node.name as string;

  node.data = {
    hName: 'div',
    hProperties: {
      className: ['boxout', name],
    },
  };

  const attributes = node.attributes as Record<string, string>;

  if (attributes.icon) {
    node.data.hProperties.className.push(`${attributes.icon}-icon`);
  }

  const children = node.children as Node[];

  const newChildren: Node[] = [];

  if (children[0]?.data?.directiveLabel) {
    const label = children.shift() as Node;
    newChildren.push({
      type: 'element',
      tagName: 'h3',
      children: label.children,
    });
  }

  newChildren.push(
    ...children
      .filter((o) => o.name !== 'answer')
      .map((child) => toHast(child))
  );

  node.data.hChildren = newChildren;
}
