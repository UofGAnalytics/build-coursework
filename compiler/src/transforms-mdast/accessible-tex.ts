import { Node, Parent } from 'unist';
import visit from 'unist-util-visit';

import { mmlToSpeech, mmlToSvg } from '../latex/mathjax-tex';
import { Context } from '../types';
import { createAccessibleSvg } from './_accessible-tex';

export function accessibleTex(ctx: Context) {
  return (tree: Node) => {
    visit(tree, 'textDirective', (node) => {
      switch (node.name) {
        case 'inlineMath':
        case 'blockMath': {
          const idx = getTexIdx(node);
          const mml = ctx.texStore[idx];
          const svg = renderSvg(mml);
          const properties = {
            ...svg.properties,
            className:
              node.name === 'inlineMath' ? 'inline-math' : 'block-math',
          };
          // console.log(svg);
          node.data = {
            hName: svg.tagName,
            hProperties: properties,
            hChildren: svg.children,
          };
        }
      }
    });
  };
}

function getTexIdx(node: Node) {
  return Number(node.children[0].value);
}

function renderSvg(mml: string) {
  const label = mmlToSpeech(mml);
  const svg = mmlToSvg(mml);
  return createAccessibleSvg(svg, label);
}
