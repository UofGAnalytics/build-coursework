import path from 'path';

import { Node } from 'unist';
import visit from 'unist-util-visit';
import { VFile } from 'vfile';

import { failMessage } from '../utils/message';
import { checkFileExists } from '../utils/utils';

export function embedAssetUrl() {
  async function getAssetUrl(node: Node, file: VFile) {
    const url = (node.url || '') as string;
    if (!file.dirname) {
      throw new Error('VFile dirname undefined');
    }
    if (!url.startsWith('http')) {
      const fullPath = path.join(file.cwd, file.dirname, url);
      const exists = await checkFileExists(fullPath);
      if (exists) {
        node.url = fullPath;
      } else {
        failMessage(file, `No asset found at ${url}`, node.position);
      }
    }
  }

  return async (tree: Node, file: VFile) => {
    const transformations: Promise<void>[] = [];
    visit(tree, 'image', (node) => {
      transformations.push(getAssetUrl(node, file));
    });
    await Promise.all(transformations);
  };
}
