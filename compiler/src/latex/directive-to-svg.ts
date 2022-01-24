import { Element, Literal } from 'hast';
import { Parent, Root } from 'mdast';
import { TextDirective } from 'mdast-util-directive';
import { visit } from 'unist-util-visit';

import { Context } from '../context';
import { rehypeParser } from '../utils/utils';
import { mmlToSpeech, mmlToSvg } from './mathjax-tex';

export function aliasDirectiveToSvg(ctx: Context) {
  return (tree: Root) => {
    visit(tree, 'textDirective', (node) => {
      if (!ctx.mmlStore || ctx.options.noTexSvg) {
        return;
      }
      switch (node.name) {
        case 'inlineMath':
        case 'blockMath': {
          const idx = getTexIdx(node as TextDirective);
          const mml = ctx.mmlStore[idx];
          const svg = renderSvg(mml);
          const properties = {
            ...svg.properties,
            className:
              node.name === 'inlineMath' ? 'inline-math' : 'block-math',
            id: getRefId(mml),
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

function getTexIdx(node: Parent) {
  const firstChild = node.children[0] as Literal;
  return Number(firstChild.value || 0);
}

function getRefId(mml: string) {
  const match = mml.match(/<mtd.+?id="(.*?)"/);
  if (match === null) {
    return undefined;
  }
  return match[1];
}

function renderSvg(mml: string) {
  const label = mmlToSpeech(mml);
  const svg = mmlToSvg(mml);
  return createAccessibleSvg(svg, label);
}

function createAccessibleSvg(mathjaxSvg: string, label: string = '') {
  const tree = rehypeParser.parse(mathjaxSvg);
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
