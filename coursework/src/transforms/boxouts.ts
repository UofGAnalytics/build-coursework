import { Node } from 'unist';
import visit from 'unist-util-visit';
import toHast from 'mdast-util-to-hast';

export function boxouts() {
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
      }
    });

    await Promise.all(transformations);
    return tree;
  };
}

async function template(node: Node) {
  const name = node.name as string;
  const children = node.children as Node[];
  const attributes = node.attributes as Record<string, string>;
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

  const data = {
    hName: 'div',
    hProperties: {
      className: ['boxout', name],
    },
    hChildren: newChildren,
  };

  if (attributes.icon) {
    data.hProperties.className.push(`${attributes.icon}-icon`);
  }

  node.data = data;
}
