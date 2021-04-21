import { Node } from 'unist';
import visit from 'unist-util-visit';

export function images() {
  let count = 0;
  return (tree: Node) => {
    visit(tree, 'image', (node) => {
      template(node, ++count);
    });
  };
}

function template(node: Node, count: number) {
  node.type = 'custom-image';

  node.data = {
    hName: 'figure',
    hProperties: {
      className: ['img-wrapper'],
    },
    hChildren: [
      {
        type: 'element',
        tagName: 'img',
        properties: {
          src: node.url,
          alt: node.alt,
        },
        children: [],
      },
      {
        type: 'element',
        tagName: 'figcaption',
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: 'caption-count',
            },
            children: [
              {
                type: 'text',
                value: `Figure ${count}:`,
              },
            ],
          },
          {
            type: 'text',
            value: ` ${node.alt}`,
          },
        ],
      },
    ],
  };
}
