import { visit } from 'unist-util-visit';
import { LeafDirective, TextDirective } from 'mdast-util-directive';
import { Literal, Node } from 'hast';
import { Parent } from 'mdast';

import { CodeBlock, Context } from '../context';

export function aliasDirectiveToCode(ctx: Context) {
  return (tree: Node) => {
    visit(tree, (node: Node) => {
      if (
        node.type === 'leafDirective' &&
        (node as LeafDirective).name === 'codeBlock'
      ) {
        const idx = getStoreIdx(node as Parent);
        if (ctx.codeStore === undefined) {
          return;
        }
        const stored = ctx.codeStore[idx] as CodeBlock;
        if (!stored) {
          return;
        }
        Object.assign(node, {
          type: 'code',
          name: undefined,
          lang: stored.lang,
          meta: stored.meta,
          value: stored.value,
          children: [],
        });
      }
      if (
        node.type === 'textDirective' &&
        (node as TextDirective).name === 'codeBlock'
      ) {
        const idx = getStoreIdx(node as Parent);
        if (ctx.codeStore === undefined) {
          return;
        }
        const stored = ctx.codeStore[idx] as CodeBlock;
        if (!stored) {
          return;
        }
        Object.assign(node, {
          type: 'inlineCode',
          name: undefined,
          value: stored.value,
          children: [],
        });
      }
    });
  };
}

function getStoreIdx(node: Parent) {
  const firstChild = node.children[0] as Literal;
  return Number(firstChild.value || 0);
}
