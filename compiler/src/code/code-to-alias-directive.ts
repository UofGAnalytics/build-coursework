import { VFile } from 'vfile';
import { unified } from 'unified';
import { Code } from 'mdast';
import { Node } from 'unist';
import markdown from 'remark-parse';
import directive from 'remark-directive';
import stringify from 'remark-stringify';
import { visit } from 'unist-util-visit';

import { Context, CodeBlock } from '../context';

// The reason for replacing all fenced code blocks with aliases
// temporarily is because of MathJax.  MathJax is designed to look
// for TeX code inside HTML files, and in our case we need to make it
// look inside a Markdown file. This leads to MathJax looking for TeX
// inside code blocks, which can causes problems (especially with SAS
// code syntax).  So this function replaces code blocks with an alias,
// allows MathJax to do it's thing, then adds it back in with
// `aliasDirectiveToCode`.

export async function codeToAliasDirective(file: VFile, ctx: Context) {
  const store: CodeBlock[] = [];

  const processed = await unified()
    .use(markdown)
    .use(stringify)
    .use(codeBlocks, store)
    .use(directive)
    .process(file);

  file.value = String(processed);
  ctx.codeStore = store;
  return file;
}

function codeBlocks(store: CodeBlock[]) {
  return (tree: Node) => {
    visit(tree, 'code', (node: Code) => {
      store.push({
        lang: String(node.lang),
        meta: String(node.meta),
        value: node.value,
      });
      Object.assign(node, {
        type: 'leafDirective',
        name: 'codeBlock',
        lang: undefined,
        meta: undefined,
        value: undefined,
        children: [
          {
            type: 'text',
            value: String(store.length - 1),
          },
        ],
      });
    });
  };
}
