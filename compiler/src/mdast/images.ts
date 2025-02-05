import { Element, ElementContent, Parent } from 'hast';
import kebabCase from 'lodash/kebabCase.js';
import { Image } from 'mdast';
import { Properties } from 'hast';
import { Literal, Node } from 'unist';
import { visit } from 'unist-util-visit';
import querystring from 'querystring';

import { Context } from '../context';
import { getAssetHast } from '../utils/get-asset-hast';

export function images(ctx: Context) {
  return (tree: Node) => {
    visit(tree, (node) => {
      if (node.type === 'image') {
        const image = node as Image;
        const { src, attributes } = parseQueryString(image.url);
        const noFigure = Boolean(attributes.noFigure);
        const count = attributes.figCount || ++ctx.figureCounter;
        templateFromImage(image, src, noFigure, String(count));
      }

      if (node.type === 'html') {
        const literal = node as Literal;
        const value = String(literal.value);

        if (value.startsWith('<div class="figure">')) {
          const hast = getAssetHast(value);
          const children = hast.children as Element[];
          const img = children.find((o) => o.tagName === 'img');
          const props = img?.properties || {};
          const { src, attributes } = parseQueryString(String(props.src));
          const noFigure = Boolean(attributes.noFigure);
          const count = attributes.figCount || ++ctx.figureCounter;
          templateFromHTML(literal, src, props, noFigure, String(count));
        }
      }
    });
  };
}

function templateFromImage(
  node: Image,
  src: string,
  noFigure: boolean,
  count: string,
) {
  const alt = getAltText(node.alt || '');
  const title = getAltText(node.title || '');
  const data = (node.data || {}) as Record<string, string>;
  const width = data.width;
  const slug = kebabCase(title || alt || `Figure ${count}`);
  createFigure(node, slug, src, alt, title, width, noFigure, count);
}

function templateFromHTML(
  node: Literal,
  src: string,
  properties: Properties,
  noFigure: boolean,
  count: string,
) {
  // @ts-expect-error
  const alt = getAltText(properties.alt || '');
  // @ts-expect-error
  const title = getAltText(properties.title || '');
  const width = properties.width;
  const slug = kebabCase(title || alt || `Figure ${count}`);
  createFigure(node, slug, src, alt, title, width, noFigure, count);
}

function createFigure(
  node: Image | Literal,
  slug: string,
  src: string,
  alt: string,
  title: string,
  width: unknown,
  noFigure: boolean,
  count: string,
) {
  const figure = {
    type: 'custom-image',
    data: {
      hName: 'figure',
      hProperties: {
        className: ['img-wrapper'],
        id: slug,
      },
      hChildren: [createImage(src, alt, width)],
    },
  };

  if (!noFigure) {
    figure.data.hChildren.push(createCaption(title || alt, slug, count));
  }

  Object.assign(node, figure);
}

function createImage(src: string, alt: string, width: unknown): Element {
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

function createCaption(alt: string, slug: string, count: string): Element {
  return {
    type: 'element',
    tagName: 'figcaption',
    properties: {},
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

function createLabel(alt: string, count: string) {
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
    const elem = label[0] as Parent;
    const content = elem.children[0] as Literal;
    content.value += ':';

    label.push({
      type: 'text',
      value: ` ${alt}`,
    });
  }

  return label;
}

function parseQueryString(src: string) {
  const idx = src.indexOf('?');

  if (idx === -1) {
    return { src, attributes: {} };
  }

  return {
    src: src.slice(0, idx),
    attributes: { ...querystring.parse(src.slice(idx + 1)) },
  };
}

function getAltText(altText: string) {
  if (altText.includes('unnamed-chunk')) {
    return '';
  }
  return altText;
}
