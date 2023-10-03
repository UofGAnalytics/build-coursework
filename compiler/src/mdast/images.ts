import { Element, ElementContent } from 'hast';
import kebabCase from 'lodash/kebabCase.js';
import { Image } from 'mdast';
import { Literal, Node } from 'unist';
import { visit } from 'unist-util-visit';

import { Context } from '../context';
import { getAssetHast } from '../utils/get-asset-hast';

export function images(ctx: Context) {
  return (tree: Node) => {
    visit(tree, 'image', (node) => {
      templateFromImage(node, ++ctx.figureCounter);
    });

    // knitr can output HTML for plots instead of Markdown now
    visit(tree, 'html', (node: Literal) => {
      const value = String(node.value);
      if (value.startsWith('<div class="figure">')) {
        const hast = getAssetHast(value);
        templateFromHTML(node, hast, ++ctx.figureCounter);
      }
    });
  };
}

function templateFromImage(node: Image, count: number) {
  const alt = getAltText(node.alt || '');
  const slug = kebabCase(alt ? alt : `Figure ${count}`);
  createFigure(node, slug, node.url, alt, node.data?.width, count);
}

function templateFromHTML(node: Literal, hast: Element, count: number) {
  const children = hast.children as Element[];
  const img = children.find((o) => o.tagName === 'img');
  const properties = img?.properties || {};
  const src = String(properties.src);
  const alt = getAltText(String(properties.alt));
  const width = properties.width;
  const slug = kebabCase(alt ? alt : `Figure ${count}`);
  createFigure(node, slug, src, alt, width, count);
}

function createFigure(
  node: Image | Literal,
  slug: string,
  src: string,
  alt: string,
  width: unknown,
  count: number
) {
  Object.assign(node, {
    type: 'custom-image',
    data: {
      hName: 'figure',
      hProperties: {
        className: ['img-wrapper'],
        id: slug,
      },
      hChildren: [
        createImage(src, alt, width),
        createCaption(alt, slug, count),
      ],
    },
  });
}

function createImage(src: string, alt: string, width: unknown) {
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
        properties: { src, alt },
        children: [],
      },
    ],
  };

  if (width && /^\d+px/.test(String(width))) {
    image.properties = {
      ...image.properties,
      style: `width: ${width};`,
    };
  }

  return image;
}

function createCaption(alt: string, slug: string, count: number) {
  return {
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
}

function createLabel(alt: string, count: number) {
  const label: ElementContent[] = [
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

  if (alt) {
    label.push({
      type: 'text',
      value: ` ${alt}`,
    });
  }

  return label;
}

function getAltText(altText: string) {
  if (altText.includes('unnamed-chunk')) {
    return '';
  }
  return altText;
}
