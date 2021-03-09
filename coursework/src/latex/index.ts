import { Node } from 'unist';
import visit from 'unist-util-visit';
import { convertLatex } from './convert-latex';
import { customSvgOutput } from './custom-svg-output';

export function accessibleLatex() {
  return (tree: Node) => {
    // console.dir(tree, { depth: null });
    visit(tree, ['math', 'inlineMath'], customMath);
  };
}

function customMath(node: Node) {
  if (!node.data) {
    node.data = {};
  }

  node.data.hName = 'div';
  node.data.hProperties = {
    className: 'math-wrapper',
  };

  const { svg, label } = convertLatex((node.value as string) || '');
  const responsiveSvg = customSvgOutput(svg);
  const uniqueId = `math-${Math.random().toString(16).slice(2)}`;

  responsiveSvg.properties['aria-labelledby'] = uniqueId;

  responsiveSvg.children.unshift({
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

  node.data.hChildren = [responsiveSvg];
}
