import unified from 'unified';
import { Node } from 'unist';
import rehype from 'rehype-parse';

type MathJaxTree = Node & {
  children: MathJaxTree[];
};

type MathJaxSvg = {
  children: Node[];
  properties: {
    [key: string]: any;
  };
};

const rehypeParser = unified().use(rehype, { fragment: true });

export function customSvgOutput(input: string) {
  const tree = rehypeParser.parse(input) as MathJaxTree;
  const svg = (tree.children[0].children[0] as unknown) as MathJaxSvg;

  svg.properties = {
    viewBox: svg.properties.viewBox,
    role: 'img',
  };

  return svg;
}
