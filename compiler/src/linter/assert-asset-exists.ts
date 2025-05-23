import { Image } from 'mdast';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

import { failMessage } from '../utils/message';
import { checkLocalFileExists } from '../utils/utils';

export function assertAssetExists() {
  return async (tree: Node, file: VFile) => {
    const transformations: Promise<void>[] = [];
    visit(tree, (node) => {
      if (node.type === 'image' || node.type === 'custom-image') {
        const image = node as Image;
        transformations.push(getAssetUrl(image, file));
      }
    });
    await Promise.all(transformations);
  };
}

async function getAssetUrl(node: Image, file: VFile) {
  const url = (node.url || '') as string;
  if (url) {
    // TODO: This keeps causing problems
    // if (process.env.NODE_ENV !== 'test' && !file.dirname) {
    //   throw new Error('VFile dirname undefined');
    // }
    if (!url.startsWith('http')) {
      const exists = await checkLocalFileExists(url);
      if (!exists) {
        failMessage(file, `No asset found at ${url}`, node.position);
      }
    }
  }
}
