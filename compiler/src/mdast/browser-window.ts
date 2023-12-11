import { Element } from 'hast';
import { Literal } from 'mdast';
import { LeafDirective } from 'mdast-util-directive';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

import { failMessage } from '../utils/message';

export function browserWindow() {
  return (tree: Node, file: VFile) => {
    visit(tree, 'leafDirective', (node: LeafDirective) => {
      if (node.name === 'browser') {
        template(node, file);
      }
    });
  };
}

function template(node: LeafDirective, file: VFile) {
  const url = node.attributes?.url || '';
  const alt = node.attributes?.alt || '';
  const imagePath = getImagePath(node, file);

  const browser = createBrowserWindow(imagePath, url, alt);
  const caption = createCaption(alt);

  Object.assign(node, {
    type: 'browser-window',
    data: {
      hName: 'figure',
      hProperties: {
        className: ['browser'],
      },
      hChildren: [browser, caption],
    },
  });
}

function createBrowserWindow(
  imagePath: string,
  url: string,
  alt: string,
): Element {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: 'browser-window',
    },
    children: [
      {
        type: 'text',
        value: '\n',
      },
      {
        type: 'element',
        tagName: 'div',
        properties: {
          className: 'browser-window-wrapper',
        },
        children: [
          createBrowserHeader(url),
          {
            type: 'text',
            value: '\n',
          },
          {
            type: 'element',
            tagName: 'div',
            properties: {
              className: 'browser-window-content',
            },
            children: [
              {
                type: 'element',
                tagName: 'img',
                properties: {
                  src: imagePath,
                  alt,
                },
                children: [],
              },
            ],
          },
          {
            type: 'text',
            value: '\n',
          },
        ],
      },
    ],
  };
}

function createBrowserHeader(url: string): Element {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: 'browser-window-header',
    },
    children: [
      {
        type: 'element',
        tagName: 'div',
        properties: {
          className: 'browser-window-address-bar',
        },
        children: [
          {
            type: 'text',
            value: url?.trim() || '',
          },
        ],
      },
    ],
  };
}

function createCaption(alt: string): Element | null {
  if (alt.trim() === '') {
    return null;
  }
  return {
    type: 'element',
    tagName: 'figcaption',
    properties: {},
    children: [
      {
        type: 'element',
        tagName: 'a',
        properties: {},
        children: [
          {
            type: 'text',
            value: ` ${alt}`,
          },
        ],
      },
    ],
  };
}

function getImagePath(node: LeafDirective, file: VFile) {
  const children = node.children as Node[];
  const firstChild = children[0] as Literal;
  const title = firstChild?.value || '';
  if (title.trim() === '') {
    failMessage(file, 'Video has no title', node.position);
  }
  return title;
}
