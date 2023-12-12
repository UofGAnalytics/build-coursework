import { Element, ElementContent } from 'hast';
import { ContainerDirective } from 'mdast-util-directive';
import { toHast } from 'mdast-util-to-hast';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';

import { Context } from '../context';

const languages = ['r', 'python'];
const titleCase = ['R', 'Python'];

export function languageSwitcher(ctx: Context) {
  const languageFlag = ctx.options.envLanguage;
  if (languageFlag !== undefined && !languages.includes(languageFlag)) {
    throw new Error(
      `[environment]: envLanguage ${languageFlag} should be one of ${languages}`,
    );
  }

  return (tree: Node) => {
    visit(tree, 'containerDirective', (node: ContainerDirective) => {
      if (node.name === 'language-switcher') {
        const children = [];
        if (languageFlag === undefined) {
          children.push(processMenu(node));
        }
        children.push(...processChildren(node, languageFlag));

        node.data = {
          hProperties: {
            className: 'language-switcher',
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
          'data-language': node.name,
        },
        children: [
          {
            type: 'text',
            value: titleCase[languages.indexOf(node.name)],
          },
        ],
      };
      return element;
    }),
  };
}

function processChildren(
  parent: ContainerDirective,
  languageFlag: string | undefined,
): ElementContent[] {
  const children = parent.children.map((node) => {
    const parent = node as ContainerDirective;
    if (languages.includes(parent.name)) {
      node.data = {
        hProperties: {
          'data-language': parent.name,
          className: [
            'language',
            languageFlag === parent.name ? 'show' : '',
          ],
        },
      };
    }
    return node;
  });

  let filtered = children;
  if (languageFlag !== undefined) {
    filtered = filtered.filter((node) => {
      const parent = node as ContainerDirective;
      return languageFlag === parent.name;
    });
  }

  const parentHast = toHast({
    type: 'root',
    children: filtered,
  }) as Element;

  return parentHast.children;
}
