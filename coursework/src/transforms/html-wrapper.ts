import { Node } from 'unist';

type Options = {
  courseTitle: string;
  unitTitle: string;
};

export function htmlWrapper(opts: Options) {
  return (tree: Node) => {
    const children = tree.children as Node[];
    return {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'div',
          properties: {
            className: 'wrapper',
          },
          children: [
            {
              type: 'element',
              tagName: 'h4',
              children: [
                {
                  type: 'text',
                  value: opts.courseTitle,
                },
              ],
            },
            {
              type: 'element',
              tagName: 'h1',
              children: [
                {
                  type: 'text',
                  value: opts.unitTitle,
                },
              ],
            },
            ...children,
          ],
        },
      ],
    };
  };
}
