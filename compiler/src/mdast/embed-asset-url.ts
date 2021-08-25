import path from 'path';

import { Image } from 'mdast';
import { Node } from 'unist';
import visit from 'unist-util-visit';
import { VFile } from 'vfile';

// import { failMessage } from '../utils/message';

export function embedAssetUrl() {
  async function getAssetUrl(node: Image, file: VFile) {
    const url = (node.url || '') as string;
    const dirname = file.dirname;
    // if (dirname === undefined) {
    //   failMessage(file, `File dirname is undefined`);
    //   return;
    // }
    if (!url.startsWith('http')) {
      const newUrl = getPath(url, dirname || '');
      // console.log(newUrl);
      node.url = newUrl;
    }
  }

  return async (tree: Node, file: VFile) => {
    const transformations: Promise<void>[] = [];
    visit<Image>(tree, 'image', (node) => {
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
