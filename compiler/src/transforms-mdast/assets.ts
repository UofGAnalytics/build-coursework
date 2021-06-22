import path from 'path';

import { Node } from 'unist';
import visit from 'unist-util-visit';
import { VFile } from 'vfile';

import { failMessage } from '../utils/message';
import { checkLocalFileExists } from '../utils/utils';

export function assertAssetExists() {
  async function getAssetUrl(node: Node, file: VFile) {
    const url = (node.url || '') as string;
    if (!file.dirname) {
      throw new Error('VFile dirname undefined');
    }
    if (!url.startsWith('http')) {
      const fullPath = getPath(url, file.dirname);
      const exists = await checkLocalFileExists(fullPath);
      if (!exists) {
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

export function embedAssetUrl() {
  async function getAssetUrl(node: Node, file: VFile) {
    const url = (node.url || '') as string;
    const dirname = (file.dirname || '') as string;
    if (!url.startsWith('http')) {
      node.url = getPath(url, dirname);
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

function getPath(url: string, dirname: string) {
  return path.isAbsolute(url)
    ? url
    : path.join(process.cwd(), dirname, url);
}
