import { Code } from 'mdast';
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
  if (nextNode.type === 'custom-code') {
    const response = nextNode as Code;
    if (response.lang === '{.bash-output}') {
      const children = (response.data?.hChildren || []) as Node[];
      responseChildren.push(...children);
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
