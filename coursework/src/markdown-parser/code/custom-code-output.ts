import { Attacher } from 'unified';
import { Node } from 'unist';
import visit from 'unist-util-visit';
import { highlight } from 'highlight.js';
import unified from 'unified';
import rehype from 'rehype-parse';
import { executeRCode } from './exec-r';
import { executeCode } from '../../execute-code';

export function customCodeOutput(dirPath: string): Attacher {
  return () => async (tree: Node) => {
    const transformations: Promise<void>[] = [];

    visit(tree, 'code', (node) => {
      transformations.push(customCode(node, dirPath));
    });

    await Promise.all(transformations);
    return tree;
  };
}

const rehypeParser = unified().use(rehype, { fragment: true });

async function customCode(node: Node, dirPath: string) {
  node.type = 'code-output';

  if (!node.data) {
    node.data = {};
  }

  node.data.hName = 'div';
  node.data.hProperties = {
    className: 'code-wrapper',
  };

  const language = String(node.lang);
  const value = String(node.value);
  const meta = node.meta as Meta;
  const highlighted = highlight(language, value).value;

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
          children: rehypeParser.parse(highlighted).children,
        },
      ],
    },
  ];

  if (meta.echo === true) {
    const output = await executeCode(dirPath, value, executeRCode);
    children.push({
      type: 'element',
      tagName: 'div',
      properties: {
        className: 'output',
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
  }

  node.data.hChildren = children;
}

type Meta = {
  echo?: boolean;
};
