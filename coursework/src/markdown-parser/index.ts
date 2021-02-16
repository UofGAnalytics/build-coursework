import fs from 'fs';
import path from 'path';

import unified from 'unified';
import markdown from 'remark-parse';
import math from 'remark-math';
import remark2rehype from 'remark-rehype';
import doc from 'rehype-document';
import stringify from 'rehype-stringify';
import { Node } from 'unist';
import visit from 'unist-util-visit';

// @ts-expect-error
import format from 'rehype-format';

import { parseCodeParams } from './code/parse-code-params';
import { customCodeOutput } from './code/custom-code-output';
import { customMathOutput } from './math/custom-math-output';

type Options = {
  dirPath: string;
  courseTitle: string;
  unitTitle: string;
};

export async function convertToHtml(contents: string, opts: Options) {
  const cssPath = path.join(process.cwd(), '../template/build/main.css');
  const style = await fs.promises.readFile(cssPath, 'utf-8');

  const jsPath = path.join(process.cwd(), '../template/build/main.js');
  const script = await fs.promises.readFile(jsPath, 'utf-8');

  const options = {
    title: `${opts.unitTitle} | ${opts.courseTitle}`,
    style: `\n${style}\n`,
    script: `\n${script}\n`,
  };

  return (
    unified()
      .use(markdown)
      .use(parseCustomCodeParams)
      .use(customCodeOutput(opts.dirPath))
      // .use(inspect())
      .use(math)
      .use(customMathOutput)
      // .use(inspect())
      .use(remark2rehype)
      .use(addWrapper(opts))
      .use(format)
      .use(stringify)
      .use(doc, options)
      .process(contents)
  );
}

function parseCustomCodeParams() {
  return (tree: Node) => {
    visit(tree, 'code', (node) => {
      const combined = `${node.lang || ''}${node.meta || ''}`;
      const { language, options } = parseCodeParams(combined);
      node.lang = language;
      node.meta = options;
    });
    return tree;
  };
}

function addWrapper(opts: Options) {
  return () => (tree: Node) => ({
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'div',
        properties: {
          className: 'wrapper',
        },
        children: [
          {
            type: 'element',
            tagName: 'h4',
            children: [
              {
                type: 'text',
                value: opts.courseTitle,
              },
            ],
          },
          {
            type: 'element',
            tagName: 'h1',
            children: [
              {
                type: 'text',
                value: opts.unitTitle,
              },
            ],
          },
          ...(tree.children as Node[]),
        ],
      },
    ],
  });
}

// function inspect() {
//   return () => (tree: Node) => {
//     log(tree);
//     // visit(tree, 'code', (node) => {
//     //   log(node);
//     // });
//     return tree;
//   };
// }

// function log(obj: Object) {
//   console.log('---------------------');
//   console.dir(obj, { depth: null });
// }
