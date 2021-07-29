import { Image } from 'mdast';
import { Node } from 'unist';
import visit from 'unist-util-visit';

export function images() {
  let count = 0;
  return (tree: Node) => {
    visit<Image>(tree, 'image', (node) => {
      template(node, ++count);
    });
  };
}

function template(node: Image, count: number) {
  Object.assign(node, {
    type: 'custom-image',
    data: {
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
    },
  });
}
