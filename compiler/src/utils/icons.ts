import { Node } from 'unist';

import { getAssetHast } from './get-asset-hast';

type UsedIcon = {
  id: string;
  viewBox: string;
  children: Node[];
};

const usedSvgs: UsedIcon[] = [];

export function createDefs() {
  return {
    type: 'element',
    tagName: 'svg',
    properties: {
      style: 'display: none',
    },
    children: [
      {
        type: 'element',
        tagName: 'defs',
        children: usedSvgs.map(createGroup),
      },
    ],
  };
}

export async function createSvg(name: string) {
  const { id, viewBox } = await getSvg(name);
  return {
    type: 'element',
    tagName: 'svg',
    properties: {
      className: ['icon', id],
      viewBox,
    },
    children: [
      {
        type: 'element',
        tagName: 'use',
        properties: {
          href: `#${id}`,
        },
        children: [],
      },
    ],
  };
}

function createGroup({ id, children }: UsedIcon) {
  return {
    type: 'element',
    tagName: 'g',
    properties: { id },
    children,
  };
}

async function getSvg(id: string) {
  const used = usedSvgs.find((o) => o.id === id);
  if (used !== undefined) {
    return used;
  }
  const hast = await getAssetHast(`${id}.svg`);
  const children = hast.children as Node[];
  const properties = hast.properties as Record<string, string>;
  const viewBox = properties.viewBox as string;
  const svg: UsedIcon = { id, viewBox, children };
  usedSvgs.push(svg);
  return svg;
}

// export const iconDefs: Node = {
//   type: 'element',
//   tagName: 'svg',
//   properties: {
//     style: 'display: none',
//   },
//   children: [
//     {
//       type: 'element',
//       tagName: 'defs',
//       children: [
//         {
//           type: 'element',
//           tagName: 'g',
//           properties: {
//             id: 'link-icon',
//           },
//           children: [
//             {
//               type: 'element',
//               tagName: 'path',
//               properties: {
//                 'fill-rule': 'evenodd',
//                 d:
//                   'M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z',
//               },
//               children: [],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };

// export const linkIcon = {
//   type: 'element',
//   tagName: 'svg',
//   properties: {
//     className: 'icon',
//     viewBox: '0 0 16 16',
//   },
//   children: [
//     {
//       type: 'element',
//       tagName: 'use',
//       properties: {
//         href: '#link-icon',
//       },
//       children: [],
//     },
//   ],
// };
