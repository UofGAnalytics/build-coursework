import toHast from 'mdast-util-to-hast';
import { Node } from 'unist';

import { getTitleValue } from './utils';

export function createWeblink(node: Node, count: number): Node[] {
  const children = node.children as Node[];
  const content = children
    .filter((o) => !o.data?.directiveLabel)
    .map((o) => ({ ...toHast(o), name: o.name }));

  const title = createTitle(node);

  return [title, ...content];
}

function createTitle(node: Node) {
  const title = getTitleValue(node);
  const { target } = node.attributes as Record<string, string>;
  return {
    type: 'element',
    tagName: 'h3',
    children: [
      {
        type: 'element',
        tagName: 'a',
        properties: {
          href: target,
          target: '_blank',
          className: ['target'],
        },
        children: [
          {
            type: 'text',
            value: title,
          },
        ],
      },
    ],
  };
}

// function createTitles(node: Node, count: number) {
//   const title = getTitleValue(node);
//   const subtitle = createSubtitle(count);
//   const titles = [subtitle];
//   if (title !== null) {
//     titles.push(createTitle(title));
//   }
//   return titles;
// }

// function createSubtitle(count: number) {
//   return {
//     type: 'element',
//     tagName: 'h3',
//     children: [
//       {
//         type: 'text',
//         value: `Web link ${count}`,
//       },
//     ],
//   };
// }

// function createTitle(title: string) {
//   return {
//     type: 'element',
//     tagName: 'h4',
//     children: [
//       {
//         type: 'text',
//         value: title,
//       },
//     ],
//   };
// }
