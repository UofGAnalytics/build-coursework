import { Node, Parent } from 'unist';
import visit from 'unist-util-visit';

import { mmlToSpeech, mmlToSvg, texToMml } from '../latex/mathjax-tex';
import { Context } from '../types';
import { cacheJsonToFile } from '../utils/cache-to-file';
import { rehypeParser } from '../utils/utils';

export function accessibleTex(ctx: Context) {
  return async (tree: Node) => {
    const transformations: Node[] = [];
    visit(tree, ['math', 'inlineMath'], (node) => {
      transformations.push(node);
    });
    await Promise.all(
      transformations.map((node) => customMath(node, ctx))
    );
  };
}

async function customMath(node: Node, ctx: Context) {
  const value = node.value as string;

  // if (node.type === 'math') {
  //   console.log(value);
  // }

  const svg = await cacheJsonToFile({
    ctx,
    prefix: 'tex',
    key: value,
    execFn: mathJaxSvg,
  });

  // if (value.startsWith('y')) {
  //   console.log(value);
  //   console.log(svg);
  // }

  node.data = {
    hName: node.type === 'inlineMath' ? 'span' : 'div',
    hProperties: {
      className: node.type === 'inlineMath' ? 'math-inline' : 'math',
    },
    hChildren: [svg],
  };
}

async function mathJaxSvg(value: string) {
  const mml = texToMml(value);
  const label = mmlToSpeech(mml);
  const svg = mmlToSvg(mml);
  return createAccessibleSvg(svg, label);
}

function createAccessibleSvg(mathjaxSvg: string, label: string = '') {
  const tree = rehypeParser.parse(mathjaxSvg) as Parent;
  const parent = tree.children[0] as Parent;
  const svg = parent.children[0] as Parent;
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
