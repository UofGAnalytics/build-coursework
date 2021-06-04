import { Node } from 'unist';

import hamburgerSvg from '../../assets/hamburger-icon.svg';
import linkSvg from '../../assets/link-icon.svg';
import { getAssetHast } from './get-asset-hast';

type Svg = {
  id: string;
  viewBox: string;
  children: Node[];
};

const svgs: Svg[] = [
  createStoredSvg('hamburger-icon', hamburgerSvg),
  createStoredSvg('link-icon', linkSvg),
];

export function createSvg(name: string) {
  const { id, viewBox } = getSvg(name);
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

function createStoredSvg(id: string, svg: string) {
  const hast = getAssetHast(svg);
  const children = hast.children as Node[];
  const properties = hast.properties as Record<string, string>;
  const viewBox = properties.viewBox as string;
  return { id, viewBox, children };
}

function getSvg(id: string) {
  const stored = svgs.find((o) => o.id === id);
  if (stored === undefined) {
    throw new Error(`svg icon not found: ${id}`);
  }
  return stored;
}

function createGroup({ id, children }: Svg) {
  return {
    type: 'element',
    tagName: 'g',
    properties: { id },
    children,
  };
}
