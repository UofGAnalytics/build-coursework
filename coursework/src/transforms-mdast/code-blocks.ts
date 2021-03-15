// @ts-expect-error
import { highlight } from 'lowlight';
import { Node } from 'unist';
import visit from 'unist-util-visit';
import { VFile } from 'vfile';
// @ts-expect-error
import report from 'vfile-reporter-pretty';

import { executeRCode } from '../r-markdown/exec-r';
import { parseCodeParams } from '../r-markdown/parse-code-params';
import { cacheToFile } from '../utils/cache-to-file';
import { failMessage } from '../utils/message';
import { rehypeParser } from '../utils/utils';

export function codeBlocks(dirPath: string | null) {
  return async (tree: Node, file: VFile) => {
    const transformations: Promise<void>[] = [];
    visit(tree, 'code', (node) => {
      transformations.push(customCode(node, dirPath, file));
    });
    await Promise.all(transformations);
    return tree;
  };
}

async function customCode(
  node: Node,
  dirPath: string | null,
  file: VFile
) {
  if (!node.data) {
    node.data = {};
  }

  node.data.hName = 'div';
  node.data.hProperties = {
    className: 'code-wrapper',
  };

  // parse custom Markdown syntax, ie. ```{r,echo=TRUE}
  const combined = `${node.lang || ''}${node.meta || ''}`;
  const { language, options } = parseCodeParams(combined);
  const value = String(node.value);

  const children: Node[] = [];

  //
  children.push({
    type: 'element',
    tagName: 'pre',
    children: [
      {
        type: 'element',
        tagName: 'code',
        properties: {
          className: language === '' ? '' : `language-${language}`,
        },
        children: highlight(language, value).value,
      },
    ],
  });

  if (options.echo === true) {
    let output = '';
    const classNames = ['output'];
    try {
      output = await cacheToFile({
        dirPath,
        prefix: 'r',
        key: value,
        execFn: executeRCode,
      });
    } catch (err) {
      failMessage(file, err.message, node.position);
    }

    const ast = rehypeParser.parse(output).children;
    children.push({
      type: 'element',
      tagName: 'div',
      properties: {
        className: classNames,
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
          children: ast,
        },
      ],
    });
  }

  node.data.hChildren = children;
}
