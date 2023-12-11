import { Element, ElementContent } from 'hast';
import { ContainerDirective } from 'mdast-util-directive';
import { toHast } from 'mdast-util-to-hast';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';

import { Context } from '../context';

const programs = ['github-desktop', 'command-line'];
const titleCase = ['GitHub Desktop', 'Command-line'];

export function programSwitcher(ctx: Context) {
  const programFlag = ctx.options.envProgram;
  if (programFlag !== undefined && !programs.includes(programFlag)) {
    throw new Error(
      `[environment]: envProgram ${programFlag} should be one of ${programs}`,
    );
  }

  return (tree: Node) => {
    visit(tree, 'containerDirective', (node: ContainerDirective) => {
      if (node.name === 'program-switcher') {
        const children = [];
        if (programFlag === undefined) {
          children.push(processMenu(node));
        }
        children.push(...processChildren(node, programFlag));

        node.data = {
          hProperties: {
            className: 'program-switcher',
          },
          hChildren: children,
        };
      }
    });
  };
}

function processMenu(parent: ContainerDirective): ElementContent {
  const children = parent.children as ContainerDirective[];
  return {
    type: 'element',
    tagName: 'ul',
    properties: {},
    children: children.map((node) => {
      const element: ElementContent = {
        type: 'element',
        tagName: 'li',
        properties: {
          'data-program': node.name,
        },
        children: [
          {
            type: 'text',
            value: titleCase[programs.indexOf(node.name)],
          },
        ],
      };
      return element;
    }),
  };
}

function processChildren(
  parent: ContainerDirective,
  programFlag: string | undefined,
): ElementContent[] {
  const children = parent.children.map((node) => {
    const parent = node as ContainerDirective;
    if (programs.includes(parent.name)) {
      node.data = {
        hProperties: {
          'data-program': parent.name,
          className: [
            'program',
            programFlag === parent.name ? 'show' : '',
          ],
        },
      };
    }
    return node;
  });

  let filtered = children;
  if (programFlag !== undefined) {
    filtered = filtered.filter((node) => {
      const parent = node as ContainerDirective;
      return programFlag === parent.name;
    });
  }

  const parentHast = toHast({
    type: 'root',
    children: filtered,
  }) as Element;

  return parentHast.children;
}
