import { rehypeParser } from '../util';

type LooseNode = Node & Record<string, any>;

export function customSvgOutput(input: string) {
  const tree = (rehypeParser.parse(input) as unknown) as LooseNode;

  const svg = tree.children[0].children[0] as LooseNode;

  svg.properties = {
    viewBox: svg.properties.viewBox,
    role: 'img',
  };

  return svg;
}
