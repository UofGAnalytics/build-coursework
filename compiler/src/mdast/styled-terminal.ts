import { parse } from 'ansicolor';
import { Code, Literal } from 'mdast';
import { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

export function styledTerminal() {
  return (tree: Node) => {
    visit(
      tree,
      'custom-code',
      (node: Code, index: number, parent: Parent) => {
        if (node.lang === 'bash') {
          wrapInStyledTerminal(node, index, parent);
        }
      }
    );
  };
}

function wrapInStyledTerminal(code: Code, index: number, parent: Parent) {
  const codeChildren = (code.data?.hChildren || []) as Node[];
  const responseChildren = [];

  const nextIdx = index + 1;
  const nextNode = parent.children[nextIdx];
  if (nextNode && nextNode.type === 'custom-code') {
    const response = nextNode as Code;
    if (response.lang === '{.bash-output}') {
      const children = (response.data?.hChildren || []) as Node[];
      const responseWithColours = ansiToHast(children);
      responseChildren.push(...responseWithColours);

      // remove response element
      parent.children.splice(nextIdx, 1);
    }
  }

  code.data = {
    hProperties: {
      className: 'terminal',
    },
    hChildren: [...codeChildren, ...responseChildren],
  };
}

function ansiToHast(children: Node[]): Node[] {
  const codeNode = {
    type: 'code',
    children: children.filter((o) => o !== null),
  };

  visit(codeNode, 'text', (node: Literal, _, parent: Parent) => {
    const parsed = parse(node.value);
    const hast = parsed.spans.map((o) => {
      if (!o.color) {
        return {
          type: 'text',
          value: o.text,
        };
      } else {
        return {
          type: 'element',
          tagName: 'span',
          properties: {
            className: o.color.name,
          },
          children: [
            {
              type: 'text',
              value: o.text,
            },
          ],
        };
      }
    });
    parent.children = hast;
  });

  return codeNode.children;
}
