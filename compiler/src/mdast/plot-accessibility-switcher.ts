import { Element, ElementContent } from 'hast';
import { ContainerDirective } from 'mdast-util-directive';
import { toHast } from 'mdast-util-to-hast';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';

import { Context } from '../context';

const tabs = ['visualisation', 'purpose', 'description'];
const titles = ['Visualisation', 'Purpose', 'Description'];

export function plotAccessibilitySwitcher(ctx: Context) {
  return (tree: Node) => {
    visit(tree, 'containerDirective', (node: ContainerDirective) => {
      if (node.name === 'plot-accessibility-switcher') {
        node.data = {
          hProperties: {
            className: 'plot-accessibility-switcher',
          },
          hChildren: [processMenu(node), ...processChildren(node)],
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
          'data-plot-accessibility': node.name,
        },
        children: [
          {
            type: 'text',
            value: titles[tabs.indexOf(node.name)],
          },
        ],
      };
      return element;
    }),
  };
}

function processChildren(parent: ContainerDirective): ElementContent[] {
  const children = parent.children.map((node) => {
    const parent = node as ContainerDirective;
    if (tabs.includes(parent.name)) {
      node.data = {
        hProperties: {
          'data-plot-accessibility': parent.name,
          className: ['plot-accessibility'],
        },
      };
    }
    return node;
  });

  const parentHast = toHast({
    type: 'root',
    children,
  }) as Element;

  return parentHast.children;
}
