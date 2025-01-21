import { Literal } from 'mdast';
import { LeafDirective, LeafDirectiveData } from 'mdast-util-directive';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

import { failMessage } from '../utils/message';
import { ElementContent } from 'hast';

export function videos() {
  return async (tree: Node, file: VFile) => {
    visit(tree, 'leafDirective', (node: LeafDirective) => {
      if (node.name === 'video') {
        const title = getTitle(node, file);
        const href = getHref(node);

        const data: LeafDirectiveData = {
          hName: 'a',
          hProperties: {
            className: ['boxout', 'video'],
            href,
            title: node.attributes?.title || null,
            target: '_blank',
          },
          hChildren: [createLabel(node, title)],
        };

        if (node.attributes?.url === undefined) {
          data.hChildren = [
            ...(data?.hChildren || []),
            createThumbnail(node),
          ];
        }

        node.data = data;
      }
    });
  };
}

function getHref(node: LeafDirective) {
  if (node.attributes?.url) {
    return node.attributes.url;
  }
  return getYoutubeUrl(node.attributes?.id || '');
}

function createLabel(node: LeafDirective, title: string): ElementContent {
  return {
    type: 'element',
    tagName: 'span',
    properties: {
      className: 'content',
    },
    children: [
      {
        type: 'element',
        tagName: 'span',
        properties: {
          className: 'type',
        },
        children: [
          {
            type: 'text',
            value: 'Video',
          },
        ],
      },
      {
        type: 'element',
        tagName: 'span',
        properties: {
          className: 'title',
        },
        children: [
          {
            type: 'text',
            value: title,
          },
        ],
      },
      {
        type: 'element',
        tagName: 'span',
        properties: {
          className: 'duration',
        },
        children: [
          {
            type: 'element',
            tagName: 'strong',
            properties: {},
            children: [
              {
                type: 'text',
                value: 'Duration',
              },
            ],
          },
          {
            type: 'text',
            value: formatDuration(node.attributes?.duration || ''),
          },
        ],
      },
    ],
  };
}

function getTitle(node: LeafDirective, file: VFile) {
  const children = node.children as Node[];
  const firstChild = children[0] as Literal;
  const title = firstChild?.value || '';
  if (title.trim() === '') {
    failMessage(file, 'Video has no title', node.position);
  }
  return title;
}

function getYoutubeUrl(id: string) {
  return `https://youtu.be/${id}`;
}

function formatDuration(duration: string = '') {
  const match = duration.match(/^(\d+)m(\d+)s$/);
  if (match === null) {
    return '';
  }
  return `${match[1]}:${match[2].padStart(2, '0')}`;
}

function createThumbnail(node: LeafDirective): ElementContent {
  const id = node.attributes?.id || '';
  return {
    type: 'element',
    tagName: 'span',
    properties: {
      className: 'thumbnail',
    },
    children: [
      {
        type: 'element',
        tagName: 'img',
        properties: {
          src: getYoutubeThumbnailUrl(id),
          alt: '',
        },
        children: [],
      },
    ],
  };
}

function getYoutubeThumbnailUrl(id: string) {
  return `http://img.youtube.com/vi/${id}/mqdefault.jpg`;
}
