// @ts-expect-error
import refractor from 'refractor';
import { Node } from 'unist';
import visit from 'unist-util-visit';
import { VFile } from 'vfile';

import { executeRCode } from '../r-markdown/exec-r';
import { parseCodeParams } from '../r-markdown/parse-code-params';
import { Context } from '../types';
import { cacheToFile } from '../utils/cache-to-file';
import { rehypeParser } from '../utils/utils';

export function codeBlocks(ctx: Context) {
  return async (tree: Node, file: VFile) => {
    const codeBlocks: Node[] = [];
    visit(tree, 'code', (node) => {
      codeBlocks.push(node);
    });

    // these need to be run in order
    for (const codeBlock of codeBlocks) {
      await customCode(codeBlock, ctx, file);
    }
  };
}

async function customCode(node: Node, ctx: Context, file: VFile) {
  const { language, options, value } = parseCodeParams(node);
  node.type = 'custom-code';
  node.data = {
    hName: 'div',
    hProperties: {
      className: 'code-wrapper',
    },
  };

  const children = [
    {
      type: 'element',
      tagName: 'code',
      properties: {
        className: language === '' ? [] : [language],
      },
      children: ctx.options.noSyntaxHighlight
        ? [
            {
              type: 'text',
              value,
            },
          ]
        : refractor.highlight(value, language.toLowerCase()),
    },
  ];

  if (language === 'r' && options.eval !== false) {
    try {
      const output = await cacheToFile({
        ctx,
        prefix: 'r',
        key: value,
        execFn: executeRCode,
      });

      if (output.trim() !== '') {
        const response = rehypeParser.parse(output).children;
        children.push({
          type: 'element',
          tagName: 'code',
          properties: {
            className: ['output'],
          },
          children: response,
        });
      }
    } catch (err) {
      const errMessage = err.message as string;
      children.push({
        type: 'element',
        tagName: 'code',
        properties: {
          className: ['output', 'error'],
        },
        children: [
          {
            type: 'text',
            value: errMessage,
          },
        ],
      });
    }
  }

  node.data.hChildren = [
    {
      type: 'element',
      tagName: 'pre',
      children,
    },
  ];
}
