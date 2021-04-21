// @ts-expect-error
import toVFile from 'to-vfile';
import { Node, Parent } from 'unist';
import { VFile } from 'vfile';

import { getAsset } from '../env';
import { rehypeParser } from '../utils/utils';

type Options = {
  courseTitle: string;
  unitTitle: string;
};

export function htmlWrapper(opts: Options) {
  return async (tree: Node) => {
    const children = tree.children as Node[];
    const crest = await getAssetHast('crest.svg');
    const uofg = await getAssetHast('uofg.svg');
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
              tagName: 'div',
              properties: {
                className: 'logo',
              },
              children: [crest, uofg],
            },
            {
              type: 'element',
              tagName: 'h1',
              children: [
                {
                  type: 'text',
                  value: opts.courseTitle,
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
                      value: opts.unitTitle,
                    },
                  ],
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

async function getAssetHast(name: string) {
  const contents = await getAsset(name);
  const vfile = toVFile({ contents }) as VFile;
  const parsed = rehypeParser().parse(vfile) as Parent;
  return parsed.children[0];
}
