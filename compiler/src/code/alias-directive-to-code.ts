import { visit } from 'unist-util-visit';
import { Literal } from 'hast';
import { Parent, Root } from 'mdast';

import { CodeBlock, Context } from "../context";

export function aliasDirectiveToCode(ctx: Context) {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (node.type === 'textDirective' && node.name === 'codeBlock') {
        const idx = getStoreIdx(node)
        if (ctx.codeStore === undefined) {
          return
        }
        const stored = ctx.codeStore[idx] as CodeBlock
        if (!ctx.codeStore[idx]) {
          return
        }
        Object.assign(node, {
          type: 'code',
          name: undefined,
          lang: stored.lang,
          meta: stored.meta,
          value: stored.value,
          children: []
        })
      }
    });
  };
}

function getStoreIdx(node: Parent) {
  const firstChild = node.children[0] as Literal;
  return Number(firstChild.value || 0);
}
