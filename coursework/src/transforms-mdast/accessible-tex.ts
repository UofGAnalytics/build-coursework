import { Node, Parent } from 'unist';
import visit from 'unist-util-visit';

import { mmlToSpeech, mmlToSvg, texToMml } from '../latex/mathjax-tex';
import { rehypeParser } from '../utils/utils';

export function accessibleTex() {
  return (tree: Node) => {
    visit(tree, ['math', 'inlineMath'], customMath);
  };
}

function customMath(node: Node) {
  const className = node.type === 'inlineMath' ? 'math-inline' : 'math';
  const mml = texToMml((node.value || '') as string);
  const label = mmlToSpeech(mml);
  const mathjaxSvg = mmlToSvg(mml);
  const svg = customSvgOutput(mathjaxSvg, label);

  node.data = {
    hName: node.type === 'inlineMath' ? 'span' : 'div',
    hProperties: { className },
    hChildren: [svg],
  };
}

function customSvgOutput(mathjaxSvg: string, label: string = '') {
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
