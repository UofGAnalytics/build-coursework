import { Element } from 'hast';
import { Image, Text } from 'mdast';
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
        createCaption(node, count),
      ],
    },
  });
}

function createCaption(node: Image, count: number) {
  const result: Element = {
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
            value: `Figure ${count}`,
          },
        ],
      },
    ],
  };

  const altText = node.alt || '';

  if (altText !== '' && !altText.includes('unnamed-chunk')) {
    const currentCaption = result.children[
      result.children.length - 1
    ] as Text;
    currentCaption.value += ':';
    result.children.push({
      type: 'text',
      value: `${node.alt}`,
    });
  }

  return result;
}
