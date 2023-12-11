import ansiColor from 'ansicolor';
import { ElementContent, Node } from 'hast';
import { Code, Literal } from 'mdast';
import { Parent } from 'unist';
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
      },
    );
  };
}

function wrapInStyledTerminal(code: Code, index: number, parent: Parent) {
  const codeChildren = (code.data?.hChildren || []) as ElementContent[];
  const responseChildren = [];

  const nextIdx = index + 1;
  const nextNode = parent.children[nextIdx];
  if (nextNode && nextNode.type === 'custom-code') {
    const response = nextNode as Code;
    if (
      response.lang === '{.knitr-output}' ||
      response.lang === '{.knitr-error-output}'
    ) {
      const children = (response.data?.hChildren ||
        []) as ElementContent[];
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

function ansiToHast(children: ElementContent[]): ElementContent[] {
  const pre = children[1] as Parent;
  const code = pre.children[0] as Parent;
  const text = code.children[0] as Literal;
  const parsed = ansiColor.parse(text.value);

  const hast = parsed.spans.map((o) => {
    const text = {
      type: 'text',
      value: o.text,
    };
    if (!o.color) {
      return text;
    } else {
      return {
        type: 'element',
        tagName: 'span',
        properties: {
          className: [
            o.color.name || '',
            o.bold ? 'bold' : '',
            o.color.bright ? 'bright' : '',
          ].filter(Boolean),
        },
        children: [text],
      };
    }
  });

  code.children = hast;

  return children;
}
