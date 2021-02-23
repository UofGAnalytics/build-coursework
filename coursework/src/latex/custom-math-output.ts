import { Attacher } from 'unified';
import { Node } from 'unist';
import visit from 'unist-util-visit';
import { convertLatex } from './convert-latex';
import { customSvgOutput } from './custom-svg-output';

export const customMathOutput: Attacher = () => transformer;

async function transformer(tree: Node) {
  const transformations: Promise<void>[] = [];

  visit(tree, 'math', (node) => {
    transformations.push(customMath(node));
  });

  await Promise.all(transformations);
  return tree;
}

async function customMath(node: Node) {
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
