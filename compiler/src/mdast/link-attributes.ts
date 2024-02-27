import { Link, Literal, Parent } from 'mdast';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';
import { toSlug } from '../utils/parse-attributes';
// import { parseAttributes } from '../utils/parse-attributes';

export function linkAttributes() {
  return (tree: Node) => {
    visit(tree, 'link', (node: Link, idx: number, parent: Parent) => {
      const next = parent.children[idx + 1];

      if (!next || next.type !== 'text') {
        return;
      }
      const text = next as Literal;
      const match = text.value.match(
        /^{reference-type="ref"\sreference="(.+)"}/,
      );

      if (match === null) {
        return;
      }

      node.url = `#${toSlug(match[1])}`;

      node.data = node.data || {
        hProperties: {
          class: 'reference',
        },
      };

      next.value = next.value.slice(next.value.indexOf('}') + 1);
    });
  };
}
