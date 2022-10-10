import hashSum from 'hash-sum';
import { Element } from 'hast';
import { visit } from 'unist-util-visit';

import { getAssetHast } from './get-asset-hast';

// ensure SVG ids will not collide when inlined
export function getSvgHast(svg: string) {
  const svgNode = getAssetHast(svg) as Element;

  const hash = hashSum(svg);

  visit(svgNode, 'element', (node) => {
    if (!node.properties) {
      return;
    }

    if (node.properties.id) {
      node.properties.id = `${node.properties.id}-${hash}`;
    }

    for (const [key, value] of Object.entries(node.properties)) {
      const valueStr = String(value);
      if (isIdRef(valueStr)) {
        node.properties[key] = `${value}-${hash}`;
      } else if (isUrlIdRef(valueStr)) {
        node.properties[key] = `url(${extractUrlIdRef(valueStr)}-${hash})`;
      }
    }
  });

  return svgNode;
}

function isIdRef(value: string) {
  return !isHexColour(value) && /^#[\w\d\-_]+$/.test(value);
}

function isHexColour(value: string) {
  return /^#([0-9a-f]{3}){1,2}$/i.test(value);
}

function isUrlIdRef(value: string) {
  return /^url\(#[\w\d-_]+\)$/.test(value);
}

function extractUrlIdRef(value: string) {
  const match = value.match(/^url\((#[\w\d-_]+)\)$/);
  return match && match[1];
}
