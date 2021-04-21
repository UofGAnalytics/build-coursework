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
    const children: Node[] = [logo];
    const treeChildren = tree.children as Node[];

    if (toc !== null) {
      children.push(toHast(toc));
    }
    children.push(createH1(titles));
    children.push(...treeChildren);

    return {
      type: 'root',
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
