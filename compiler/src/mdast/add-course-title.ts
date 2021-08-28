import { Heading, Parent } from 'mdast';

import { UnitTitles } from '../course/types';

export function addCourseTitle(
  tree: Parent,
  { courseTitle, unitTitle }: UnitTitles
): Parent {
  const titles: Heading[] = [
    {
      type: 'heading',
      depth: 1,
      children: [
        {
          type: 'text',
          value: courseTitle,
        },
      ],
      data: {
        hName: 'h1',
        hChildren: [
          {
            type: 'text',
            value: courseTitle,
          },
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: 'unit',
            },
            children: [
              {
                type: 'text',
                value: unitTitle,
              },
            ],
          },
        ],
      },
    },
  ];
  return {
    ...tree,
    children: [...titles, ...tree.children],
  };
}
