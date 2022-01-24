import { Literal } from 'mdast';
import { LeafDirective } from 'mdast-util-directive';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

import { failMessage } from '../utils/message';

export function youtubeVideos() {
  return async (tree: Node, file: VFile) => {
    visit(tree, 'leafDirective', (node: LeafDirective) => {
      if (node.name === 'video') {
        const attributes = node.attributes;
        const title = getTitle(node, file);
        node.data = {
          hName: 'a',
          hProperties: {
            className: ['boxout', 'video'],
            href: getYoutubeUrl(attributes?.id || ''),
            title: attributes?.title || null,
            target: '_blank',
          },
          hChildren: [
            {
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
                      children: [
                        {
                          type: 'text',
                          value: 'Duration',
                        },
                      ],
                    },
                    {
                      type: 'text',
                      value: formatDuration(attributes?.duration || ''),
                    },
                  ],
                },
              ],
            },
            {
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
                    src: getYoutubeThumbnailUrl(attributes?.id || ''),
                    alt: '',
                  },
                  children: [],
                },
              ],
            },
          ],
        };
      }
    });
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

function getYoutubeThumbnailUrl(id: string) {
  return `http://img.youtube.com/vi/${id}/mqdefault.jpg`;
}

function formatDuration(duration: string = '') {
  const match = duration.match(/^(\d+)m(\d+)s$/);
  if (match === null) {
    return '';
  }
  return `${match[1]}:${match[2].padStart(2, '0')}`;
}
