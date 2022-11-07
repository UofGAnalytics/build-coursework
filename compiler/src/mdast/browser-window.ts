import { Literal } from 'mdast';
import { LeafDirective } from 'mdast-util-directive';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

import { failMessage } from '../utils/message';

export function browserWindow() {
  return (tree: Node, file: VFile) => {
    // visit(tree, 'image', (node) => {
    //   console.log(node);
    // });

    visit(tree, 'leafDirective', (node: LeafDirective) => {
      if (node.name === 'browser') {
        createBrowserWindow(node, file);
      }
    });
  };
}

type BrowserWindowAttributes = {
  url: string;
};

function createBrowserWindow(node: LeafDirective, file: VFile) {
  const { url } = node.attributes as BrowserWindowAttributes;
  const imagePath = getImagePath(node, file);

  Object.assign(node, {
    type: 'browser-window',
    data: {
      hName: 'div',
      hProperties: {
        className: 'browser-window',
      },
      hChildren: [
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
            {
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
            },
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
                    alt: '',
                  },
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
    },
  });
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
