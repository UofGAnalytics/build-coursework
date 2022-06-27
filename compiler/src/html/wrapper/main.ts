import { Node } from 'unist';
import { visit } from 'unist-util-visit';

import dagLogoSvg from '../../../assets/dag-logo.svg';
import coverSvg from '../../../assets/hexagons.svg';
import { Context } from '../../context';
import { Course, UnitTitles } from '../../course/types';
import { getAssetHast } from '../../utils/get-asset-hast';

export async function createMain(
  titles: UnitTitles,
  ctx: Context,
  content: Node[]
) {
  const children = [];

  if (ctx.options.noHexagons) {
    children.push(createH1(titles));
  } else {
    children.push(createCover(titles, ctx.course));
  }

  children.push(...content);

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

function createCover(titles: UnitTitles, course: Course) {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: 'cover',
    },
    children: [
      createH1(titles),
      {
        type: 'element',
        tagName: 'div',
        properties: {
          className: 'logos',
        },
        children: [
          createCoverHexagons(course.catalog || ''),
          getAssetHast(dagLogoSvg),
        ],
      },
    ],
  };
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

function createCoverHexagons(catalog: string) {
  const hexagons = getAssetHast(coverSvg);

  if (catalog !== '') {
    visit(hexagons, 'element', (node) => {
      if (node.tagName === 'g') {
        const properties = node.properties || {};
        const [className] = (properties.className || []) as string[];
        if (catalog === className) {
          properties.className = ['active'];
        } else {
          properties.className = [];
        }
        node.properties = properties;
      }
    });
  }

  return hexagons;
}
