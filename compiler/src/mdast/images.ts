import { Element } from 'hast';
import { Image, Text } from 'mdast';
import { Node } from 'unist';
import visit from 'unist-util-visit';

import { Context } from '../context';

export function images(ctx: Context) {
  return (tree: Node) => {
    visit<Image>(tree, 'image', (node) => {
      template(node, ++ctx.figureCounter);
    });
  };
}

function template(node: Image, count: number) {
  const image: Element = {
    type: 'element',
    tagName: 'img',
    properties: {
      src: node.url,
      alt: node.alt,
    },
    children: [],
  };

  if (node.data?.width) {
    image.properties = {
      ...image.properties,
      style: `width: ${node.data.width};`,
    };
  }

  const caption = createCaption(node, count);

  Object.assign(node, {
    type: 'custom-image',
    data: {
      hName: 'figure',
      hProperties: {
        className: ['img-wrapper'],
      },
      hChildren: [image, caption],
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
