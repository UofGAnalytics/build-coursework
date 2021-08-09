import { Node } from 'unist';

export async function createMain(children: Node[]) {
  return {
    type: 'element',
    tagName: 'main',
    children: [
      {
        type: 'element',
        tagName: 'div',
        properties: {
          className: 'wrapper',
        },
        children,
      },
    ],
  };
}
