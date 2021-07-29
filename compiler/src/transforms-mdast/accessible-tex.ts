import { Element, Literal } from 'hast';
import { Node, Parent } from 'unist';
import visit from 'unist-util-visit';

import { mmlToSpeech, mmlToSvg } from '../latex/mathjax-tex';
import { Context } from '../types';
import { rehypeParser } from '../utils/utils';

interface TextDirective extends Parent {
  name: string;
  attributes: Record<string, string>;
  children: Literal[];
}

export function accessibleTex(ctx: Context) {
  return (tree: Node) => {
    visit<TextDirective>(tree, 'textDirective', (node) => {
      if (!ctx.texStore) {
        return;
      }
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

function getTexIdx(node: TextDirective) {
  return Number(node.children[0].value);
}

function renderSvg(mml: string) {
  const label = mmlToSpeech(mml);
  const svg = mmlToSvg(mml);
  return createAccessibleSvg(svg, label);
}

function createAccessibleSvg(mathjaxSvg: string, label: string = '') {
  const tree = rehypeParser.parse(mathjaxSvg) as Element;
  const parent = tree.children[0] as Element;
  const svg = parent.children[0] as Element;
  const properties = svg.properties as Record<string, string>;
  // const block = properties.width === '100%';

  const newProperties: Record<string, string> = {
    // className: block ? 'math' : 'math-inline',
    width: properties.width,
    height: properties.height,
    viewBox: properties.viewBox,
    role: 'img',
  };

  if (label !== '') {
    const uniqueId = `math-${Math.random().toString(16).slice(2)}`;
    newProperties['aria-labelledby'] = uniqueId;
    svg.children.unshift({
      type: 'element',
      tagName: 'title',
      properties: {
        id: uniqueId,
      },
      children: [
        {
          type: 'text',
          value: label,
        },
      ],
    });
  }

  svg.properties = newProperties;
  return svg;
}
