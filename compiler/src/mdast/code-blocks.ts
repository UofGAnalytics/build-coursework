import { Code } from 'mdast';
// @ts-expect-error
import refractor from 'refractor';
import { Node } from 'unist';
import visit from 'unist-util-visit';
import { VFile } from 'vfile';

import { Context } from '../context';

export function codeBlocks(ctx: Context) {
  return async (tree: Node, file: VFile) => {
    const codeBlocks: Code[] = [];
    visit<Code>(tree, 'code', (node) => {
      codeBlocks.push(node);
    });

    // these need to be run in order
    for (const codeBlock of codeBlocks) {
      await customCode(codeBlock, ctx, file);
    }
  };
}

async function customCode(node: Code, ctx: Context, file: VFile) {
  // const { language, options, value } = parseCodeParams(node);
  const language = parseLanguage(node);
  const meta = (node.meta || '') as string;

  Object.assign(node, {
    type: 'custom-code',
    data: {
      hName: 'div',
      hProperties: {
        className: 'code-wrapper',
      },
      hChildren: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'element',
              tagName: 'code',
              properties: {
                className: [meta],
              },
              children:
                ctx.options.noSyntaxHighlight || language === ''
                  ? [
                      {
                        type: 'text',
                        value: node.value,
                      },
                    ]
                  : refractor.highlight(node.value, language),
            },
          ],
        },
      ],
    },
  });
}

function parseLanguage(node: Code) {
  const lang = (node.lang || '') as string;
  if (lang === 'plaintext') {
    return '';
  }
  return lang.toLowerCase();
}
