import { Node, Position } from 'unist';
import visit from 'unist-util-visit';
import { VFile } from 'vfile';
import * as yup from 'yup';

import { failMessage, warnMessage } from '../utils/message';

export function youtubeVideos() {
  return async (tree: Node, file: VFile) => {
    visit(tree, 'leafDirective', (node) => {
      if (node.name === 'video') {
        template(node, file);
      }
    });
  };
}

function template(node: Node, file: VFile) {
  if (!node.data) {
    node.data = {};
  }

  node.data.hName = 'div';
  node.data.hProperties = {
    className: 'video-wrapper',
  };

  try {
    const attributes = getAttributes(
      node.attributes,
      file,
      node.position as Position
    );

    const children: Node[] = [
      {
        type: 'element',
        tagName: 'a',
        properties: {
          href: getYoutubeUrl(attributes.id),
          title: attributes.title || null,
          target: '_blank',
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
    ];

    node.data.hChildren = children;
  } catch (err) {
    failMessage(file, err.message, node.position);
  }
}

type Attributes = {
  id: string;
  title: string;
};

const attributesSchema = yup.object().shape({
  id: yup.string().required(),
  title: yup.string(),
});

function getAttributes(attributes: any, file: VFile, position: Position) {
  if (!attributes.title) {
    warnMessage(file, 'Videos should include title attributes', position);
  }
  return attributesSchema.validateSync(attributes) as Attributes;
}

function getYoutubeUrl(id: string) {
  return `https://youtu.be/${id}`;
}

function getYoutubeThumbnailUrl(id: string) {
  return `http://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}
