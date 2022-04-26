import { Element, ElementContent } from 'hast';
import kebabCase from 'lodash/kebabCase.js';
import { Image } from 'mdast';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';

import { Context } from '../context';

export function images(ctx: Context) {
  return (tree: Node) => {
    visit(tree, 'image', (node) => {
      template(node, ++ctx.figureCounter);
    });
  };
}

function template(node: Image, count: number) {
  const image: Element = {
    type: 'element',
    tagName: 'div',
    properties: {
      className: 'img-bg',
    },
    children: [
      {
        type: 'element',
        tagName: 'img',
        properties: {
          src: node.url,
          alt: node.alt,
        },
        children: [],
      },
    ],
  };

  if (node.data?.width) {
    image.properties = {
      ...image.properties,
      style: `width: ${node.data.width};`,
    };
  }

  const alt = getAltText(node);
  const slug = kebabCase(alt ? alt : `Figure ${count}`);

  const caption = {
    type: 'element',
    tagName: 'figcaption',
    children: [
      {
        type: 'element',
        tagName: 'a',
        properties: {
          href: `#${slug}`,
        },
        children: createLabel(alt, count),
      },
    ],
  };

  Object.assign(node, {
    type: 'custom-image',
    data: {
      hName: 'figure',
      hProperties: {
        className: ['img-wrapper'],
        id: slug,
      },
      hChildren: [image, caption],
    },
  });
}

function createLabel(alt: string, count: number): ElementContent[] {
  if (alt) {
    return [
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
        value: ` ${alt}`,
      },
    ];
  }
  return [
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
  ];
}

function getAltText(node: Image) {
  const altText = node.alt || '';
  if (altText.includes('unnamed-chunk')) {
    return '';
  }
  return altText;
}
