import toHast from 'mdast-util-to-hast';
import { Node } from 'unist';

import { getTitleValue } from './utils';

export function createSupplement(node: Node, count: number): Node[] {
  const titles = createTitles(node, count);
  const children = node.children as Node[];
  const content = children
    .filter((o) => !o.data?.directiveLabel)
    .map((o) => ({ ...toHast(o), name: o.name }));

  return [...titles, ...content];
}

function createTitles(node: Node, count: number) {
  const title = getTitleValue(node);
  const subtitle = createSubtitle(count);
  const titles = [subtitle];
  if (title !== null) {
    titles.push(createTitle(title));
  }
  return titles;
}

function createSubtitle(count: number) {
  return {
    type: 'element',
    tagName: 'h3',
    children: [
      {
        type: 'text',
        value: `Supplement ${count}`,
      },
    ],
  };
}

function createTitle(title: string) {
  return {
    type: 'element',
    tagName: 'h4',
    children: [
      {
        type: 'text',
        value: title,
      },
    ],
  };
}
