import { Properties, Text } from 'hast';
import { Code } from 'mdast';
import { RefractorElement, refractor } from 'refractor/lib/all.js';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

import { Context } from '../context';

export function codeBlocks(ctx: Context) {
  return async (tree: Node, file: VFile) => {
    visit(tree, 'code', (node: Code) => {
      customCode(node, ctx, file);
    });
  };
}

function customCode(node: Code, ctx: Context, file: VFile) {
  const language = parseLanguage(node);
  const klass = parseClass(node);

  const codeProps: Properties = {};
  const children: (RefractorElement | Text)[] = [];
  const trimmed = node.value.trim();

  // console.dir(node, { depth: null });

  if (
    ctx.options.noSyntaxHighlight ||
    language === '' ||
    language.startsWith('textfile')
  ) {
    children.push({
      type: 'text',
      value: trimmed,
    });
  } else {
    const highlighted = refractor.highlight(trimmed, language);
    children.push(...highlighted.children);
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
  if (klass === 'r-output' || klass === 'r-error-output') {
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
  if (klass === 'python-output' || klass === 'python-error-output') {
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
  const trimmed = (node.lang || '').trim();

  if (trimmed === 'plaintext' || trimmed.endsWith('-output')) {
    return '';
  }
  if (trimmed.startsWith('{')) {
    const match = trimmed.match(/.lang-(\w+)/);
    if (match === null) {
      return '';
    }
    return match[1].toLowerCase();
  }
  return trimmed.toLowerCase();
}

function parseClass({ lang, meta }: Code) {
  const trimmed = (lang || '').trim();
  if (trimmed.endsWith('-output')) {
    return trimmed;
  }
  const m = !meta || meta === 'null' ? '' : meta;
  const combined = `${trimmed} ${m}`.trim();
  if (!combined.startsWith('{.')) {
    return '';
  }
  return combined;
}
