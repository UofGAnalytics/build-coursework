import { rehypeParser } from '../util';

export function customSvgOutput(input: string) {
  const tree = rehypeParser.parse(input);

  const svg = tree.children[0].children[0] as unknown;

  svg.properties = {
    viewBox: svg.properties.viewBox,
    role: 'img',
  };

  return svg;
}
