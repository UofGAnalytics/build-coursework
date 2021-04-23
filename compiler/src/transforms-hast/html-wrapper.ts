import toHast from 'mdast-util-to-hast';
// @ts-expect-error
import toVFile from 'to-vfile';
import { Node, Parent } from 'unist';
import { VFile } from 'vfile';

import { UnitTitles } from '../course/types';
import { getAsset } from '../env';
import { rehypeParser } from '../utils/utils';

export function htmlWrapper(titles: UnitTitles, toc: Node | null) {
  return async (tree: Node) => {
    const logo = await createLogo();
    const content = tree.children as Node[];
    return {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'aside',
          children: [
            logo,
            {
              type: 'element',
              tagName: 'nav',
              children: [
                {
                  type: 'element',
                  tagName: 'div',
                  properties: {
                    id: 'view-options',
                  },
                  children: [
                    {
                      type: 'text',
                      value: 'View options',
                    },
                  ],
                },
                toHast(toc as Node),
              ],
            },
          ],
        },
        {
          type: 'element',
          tagName: 'main',
          children: [
            {
              type: 'element',
              tagName: 'div',
              properties: {
                className: 'wrapper',
              },
              children: [createH1(titles), ...content],
            },
          ],
        },
        // {
        //   type: 'element',
        //   tagName: 'div',
        //   properties: {
        //     id: 'modal',
        //   },
        //   children: [
        //     {
        //       type: 'element',
        //       tagName: 'div',
        //       properties: {
        //         id: 'modal-bg',
        //       },
        //       children: [],
        //     },
        //     {
        //       type: 'element',
        //       tagName: 'div',
        //       properties: {
        //         id: 'modal-content',
        //       },
        //       children: [],
        //     },
        //   ],
        // },
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

function createH1(titles: UnitTitles) {
  return {
    type: 'element',
    tagName: 'h1',
    children: [
      {
        type: 'text',
        value: titles.courseTitle,
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
            value: titles.unitTitle,
          },
        ],
      },
    ],
  };
}

async function createLogo() {
  const crest = await getAssetHast('crest.svg');
  const uofg = await getAssetHast('uofg.svg');
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: 'logo',
    },
    children: [crest, uofg],
  };
}
