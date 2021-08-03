import { Element, Literal } from 'hast';
import { Node, Parent } from 'unist';
import visit from 'unist-util-visit';

import { Context } from '../context';
import { rehypeParser } from '../utils/utils';
import { mmlToSpeech, mmlToSvg } from './mathjax-tex';

interface TextDirective extends Parent {
  name: string;
  attributes: Record<string, string>;
  children: Literal[];
}

export function aliasDirectiveToSvg(ctx: Context) {
  return (tree: Node) => {
    visit<TextDirective>(tree, 'textDirective', (node) => {
      if (!ctx.mmlStore) {
        return;
      }
      switch (node.name) {
        case 'refMath': {
          console.log(node);
          return;
        }
        case 'inlineMath':
        case 'blockMath': {
          const idx = getTexIdx(node);
          const mml = ctx.mmlStore[idx];
          // console.log(mml);
          const svg = renderSvg(mml);
          const properties = {
            ...svg.properties,
            className:
              node.name === 'inlineMath' ? 'inline-math' : 'block-math',
          };
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

  const newProperties: Record<string, string> = {
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
