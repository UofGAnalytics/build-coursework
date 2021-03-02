import { VFile } from 'vfile';
import { Node, Position } from 'unist';
import fetch from 'node-fetch';
import * as yup from 'yup';
import visit from 'unist-util-visit';
import { cacheToFile } from '../cache-to-file';

export function video(dirPath: string) {
  return async (tree: Node, file: VFile) => {
    const transformations: Promise<void>[] = [];

    visit(tree, 'leafDirective', (node) => {
      if (node.name === 'video') {
        transformations.push(template(node, file, dirPath));
      }
    });

    await Promise.all(transformations);
    return tree;
  };
}

type Attributes = {
  id: string;
  title: string;
};

const attributesSchema = yup.object().shape({
  id: yup.string().required(),
  title: yup.string(),
});

async function template(node: Node, file: VFile, dirPath: string) {
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

    const imageData = await cacheToFile({
      dirPath,
      prefix: 'youtube',
      key: attributes.id,
      execFn: getImageData,
    });

    const children: Node[] = [
      {
        type: 'element',
        tagName: 'a',
        properties: {
          href: `https://youtu.be/${attributes.id}`,
          title: attributes.title,
          target: '_blank',
        },
        children: [
          {
            type: 'element',
            tagName: 'img',
            properties: {
              src: `data:image/jpg;base64,${imageData}`,
              alt: '',
            },
            children: [],
          },
        ],
      },
    ];

    node.data.hChildren = children;
  } catch (err) {
    file.message(err.message, node.position);
  }
}

function getAttributes(attributes: any, file: VFile, position: Position) {
  if (!attributes.title) {
    file.message('Videos should include title attributes', position);
  }
  return attributesSchema.validateSync(attributes) as Attributes;
}

async function getImageData(id: string) {
  const url = `http://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  const response = await fetch(url);
  const buffer = await response.buffer();
  return buffer.toString('base64');
}
