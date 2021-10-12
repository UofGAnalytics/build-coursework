import { Properties, Text } from 'hast';
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

    for (const codeBlock of codeBlocks) {
      customCode(codeBlock, ctx, file);
    }
  };
}

function customCode(node: Code, ctx: Context, file: VFile) {
  // const { language, options, value } = parseCodeParams(node);
  const language = parseLanguage(node);
  const klass = parseClass(node);
  const meta = (node.meta || '') as string;

  const codeProps: Properties = {};
  if (meta !== '') {
    codeProps.className = meta;
  }

  const children: Text[] = [];
  const trimmed = node.value.trim();
  if (ctx.options.noSyntaxHighlight || language === '') {
    children.push({
      type: 'text',
      value: trimmed,
    });
  } else {
    children.push(...refractor.highlight(trimmed, language));
  }

  Object.assign(node, {
    type: 'custom-code',
    data: {
      hName: 'div',
      hProperties: {
        className: ['code-wrapper', klass],
      },
      hChildren: [
        addConsoleHeading(klass),
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'element',
              tagName: 'code',
              properties: codeProps,
              children,
            },
          ],
        },
      ],
    },
  });
}

function addConsoleHeading(klass: string) {
  if (klass === 'r-output' || klass === 'r-error') {
    return {
      type: 'element',
      tagName: 'h6',
      properties: {
        className: 'console-heading',
      },
      children: [
        {
          type: 'text',
          value: 'R Console',
        },
      ],
    };
  }
  if (klass === 'python-output' || klass === 'python-error') {
    return {
      type: 'element',
      tagName: 'h6',
      properties: {
        className: 'console-heading',
      },
      children: [
        {
          type: 'text',
          value: 'Python Console',
        },
      ],
    };
  }
  return null;
}

function parseLanguage(node: Code) {
  const lang = (node.lang || '') as string;
  if (lang === 'plaintext' || lang.startsWith('{')) {
    return '';
  }
  return lang.toLowerCase();
}

function parseClass(node: Code) {
  const lang = (node.lang || '') as string;
  if (!lang.startsWith('{.')) {
    return '';
  }
  return lang.slice(2, -1);
}
