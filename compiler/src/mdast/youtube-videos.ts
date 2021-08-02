import { Literal } from 'mdast';
import { Node, Parent } from 'unist';
import visit from 'unist-util-visit';
import { VFile } from 'vfile';

interface LeafDirective extends Parent {
  name: string;
  attributes: Record<string, string>;
}

export function youtubeVideos() {
  return async (tree: Node, file: VFile) => {
    visit<LeafDirective>(tree, 'leafDirective', (node) => {
      if (node.name === 'video') {
        const attributes = node.attributes as Record<string, string>;
        const title = getTitle(node);
        node.data = {
          hName: 'a',
          hProperties: {
            className: ['boxout', 'video'],
            href: getYoutubeUrl(attributes.id),
            title: attributes.title || null,
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
                      value: formatDuration(attributes.duration),
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
                    src: getYoutubeThumbnailUrl(attributes.id),
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

function getTitle(node: LeafDirective) {
  const children = node.children as Node[];
  const firstChild = children[0] as Literal;
  return firstChild.value as string;
}

function getYoutubeUrl(id: string) {
  return `https://youtu.be/${id}`;
}

function getYoutubeThumbnailUrl(id: string) {
  return `http://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

function formatDuration(duration: string = '') {
  const match = duration.match(/^(\d+)m(\d+)s$/);
  if (match === null) {
    return '';
  }
  return `${match[1]}:${match[2].padStart(2, '0')}`;
}
