import { Node } from 'unist';
import { visit } from 'unist-util-visit';

import coverSvg from '../../../assets/cover.svg';
import { Course, UnitTitles } from '../../course/types';
import { getAssetHast } from '../../utils/get-asset-hast';

export async function createMain(
  titles: UnitTitles,
  course: Course,
  content: Node[]
) {
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
        children: [
          createH1(titles),
          createLogo(course.catalog),
          ...content,
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

function createLogo(catalog: string) {
  const cover = getAssetHast(coverSvg);

  visit(cover, 'element', (node) => {
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

  return cover;
}
