import { Code } from 'mdast';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';

export function textFile() {
  return (tree: Node) => {
    visit(tree, 'code', (node: Code) => {
      if (node.lang === 'textfile') {
        createTextFile(node);
      }
    });
  };
}

function createTextFile(node: Code) {
  Object.assign(node, {
    type: 'text-file',
    data: {
      hName: 'div',
      hProperties: {
        className: 'text-file',
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
            className: 'text-file-wrapper',
          },
          children: [
            {
              type: 'element',
              tagName: 'div',
              properties: {
                className: 'text-file-header',
              },
              children: [
                {
                  type: 'text',
                  value: node.meta?.trim() || '',
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
                className: 'text-file-content',
              },
              children: [
                {
                  type: 'text',
                  value: node.value,
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
