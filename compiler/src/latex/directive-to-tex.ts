// import { Literal } from 'hast';
// import { Parent, Root } from 'mdast';
// import { visit } from 'unist-util-visit';

// import { Context } from '../context';

// export function aliasDirectiveToTex(ctx: Context) {
//   return (tree: Root) => {
//     visit(tree, 'textDirective', (node) => {
//       switch (node.name) {
//         case 'inlineMath': {
//           const tex = getStoredTex(node, ctx);
//           node.data = getTexSpan(tex, 'inline');
//           break;
//         }
//         case 'blockMath': {
//           const tex = getStoredTex(node, ctx);
//           node.data = getTexSpan(tex, 'block');
//           break;
//         }
//       }
//     });
//   };
// }

// function getStoredTex(node: Parent, ctx: Context) {
//   if (!ctx.mmlStore) {
//     throw new Error(`[tex-directive-to-text]: no ctx.mmlStore`);
//   }
//   const idx = getTexIdx(node);
//   return ctx.mmlStore[idx];
// }

// function getTexIdx(node: Parent) {
//   const firstChild = node.children[0] as Literal;
//   return Number(firstChild.value || 0);
// }

// function getTexSpan(tex: string, display: 'inline' | 'block') {
//   return {
//     hName: 'span',
//     hProperties: { className: ['tex'] },
//     hChildren: [
//       {
//         type: 'text',
//         value: display === 'inline' ? `$${tex}$` : `$$\n${tex}\n$$`,
//       },
//     ],
//   };
// }
