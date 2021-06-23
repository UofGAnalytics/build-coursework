import path from 'path';

import { Node } from 'unist';
import visit from 'unist-util-visit';
import { VFile } from 'vfile';

export function embedAssetUrl() {
  async function getAssetUrl(node: Node, file: VFile) {
    const url = (node.url || '') as string;
    const dirname = (file.dirname || '') as string;
    if (!url.startsWith('http')) {
      const newUrl = getPath(url, dirname);
      node.url = newUrl;
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
