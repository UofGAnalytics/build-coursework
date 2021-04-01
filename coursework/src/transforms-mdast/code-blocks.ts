// @ts-expect-error
import { highlight } from 'lowlight';
import { Node } from 'unist';
import visit from 'unist-util-visit';
import { VFile } from 'vfile';

import { executeRCode } from '../r-markdown/exec-r';
import { parseCodeParams } from '../r-markdown/parse-code-params';
import { Context } from '../types';
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
  // parse custom Markdown syntax, ie. ```{r,echo=TRUE}
  const combined = `${node.lang || ''}${node.meta || ''}`;
  const { language, options } = parseCodeParams(combined);
  const value = String(node.value || '');

  node.data = {
    hName: 'div',
    hProperties: {
      className: 'code-wrapper',
    },
  };

  const children: Node[] = [
    {
      type: 'element',
      tagName: 'pre',
      children: [
        {
          type: 'element',
          tagName: 'code',
          properties: {
            className: language === '' ? '' : `language-${language}`,
          },
          children: ctx.options.noSyntaxHighlight
            ? [
                {
                  type: 'text',
                  value,
                },
              ]
            : highlight(language, value).value,
        },
      ],
    },
  ];

  if (language !== 'r' || options.eval === false) {
    return;
  }

  const output = await executeRCode(value as string);

  if (output.trim() === '') {
    return;
  }

  children.push({
    type: 'element',
    tagName: 'div',
    properties: {
      className: ['output'],
    },
    children: [
      {
        type: 'element',
        tagName: 'h3',
        children: [
          {
            type: 'text',
            value: 'Output',
          },
        ],
      },
      {
        type: 'element',
        tagName: 'code',
        children: rehypeParser.parse(output).children,
      },
    ],
  });

  node.data.hChildren = children;
}
