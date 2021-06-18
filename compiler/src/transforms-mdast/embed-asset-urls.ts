import path from 'path';

import { Node } from 'unist';
import visit from 'unist-util-visit';
import { VFile } from 'vfile';

import { Context } from '../types';
import { failMessage } from '../utils/message';
import { checkLocalFileExists } from '../utils/utils';

export function embedAssetUrl(ctx: Context) {
  async function getAssetUrl(node: Node, file: VFile) {
    const url = (node.url || '') as string;
    if (!file.dirname) {
      throw new Error('VFile dirname undefined');
    }
    if (!url.startsWith('http') && !url.startsWith('/')) {
      const fullPath = path.join(process.cwd(), file.dirname, url);
      const exists = await checkLocalFileExists(fullPath);
      if (exists) {
        node.url = fullPath;
      } else {
        failMessage(file, `No asset found at ${fullPath}`, node.position);
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
