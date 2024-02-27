import { Heading, Literal } from 'mdast';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';
import { parseAttributes } from '../utils/parse-attributes';

export function headingAttributes() {
  return (tree: Node) => {
    visit(tree, 'heading', (node: Heading) => {
      transformHeadings(node);
    });
  };
}

function transformHeadings(node: Heading) {
  const text = node.children[0] as Literal;
  const match = text.value.match(/^(.+)\{(.+)\}$/);
  if (match === null) {
    return;
  }

  text.value = match[1].trim();

  const attributes = parseAttributes(match[2]);

  const properties: Record<string, string> = {};

  if (attributes.id) {
    properties.id = attributes.id;
  }
  if (attributes.classes.length) {
    properties.class = attributes.classes.join(' ');
  }

  node.data = node.data || {
    hProperties: properties,
  };
}
