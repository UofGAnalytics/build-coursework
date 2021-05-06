import { Node } from 'unist';

import { getAssetHast } from './get-asset-hast';

type Svg = {
  id: string;
  viewBox: string;
  children: Node[];
};

const svgs: Svg[] = [];

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
        children: svgs.map(createGroup),
      },
    ],
  };
}

async function getSvg(id: string) {
  const used = svgs.find((o) => o.id === id);
  if (used !== undefined) {
    return used;
  }
  const hast = await getAssetHast(`${id}.svg`);
  const children = hast.children as Node[];
  const properties = hast.properties as Record<string, string>;
  const viewBox = properties.viewBox as string;

  const svg: Svg = { id, viewBox, children };
  svgs.push(svg);
  return svg;
}

function createGroup({ id, children }: Svg) {
  return {
    type: 'element',
    tagName: 'g',
    properties: { id },
    children,
  };
}
