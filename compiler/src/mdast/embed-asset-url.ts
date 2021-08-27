import path from 'path';

import { Image, Text } from 'mdast';
import { Node } from 'unist';
import visit from 'unist-util-visit';
import { VFile } from 'vfile';

// import { failMessage } from '../utils/message';

export function embedAssetUrl() {
  return async (tree: Node, file: VFile) => {
    const dirname = file.dirname || '';
    // if (dirname === undefined) {
    //   failMessage(file, `File dirname is undefined`);
    //   return;
    // }

    visit<Image>(tree, 'image', (node) => {
      const url = node.url || '';
      if (!url.startsWith('http')) {
        node.url = getPath(url, dirname);
      }
    });

    // also fix for "raw" html nodes sometimes output by knitr
    visit<Text>(tree, ['html'], (node) => {
      node.value = node.value.replace(/src="(.+?)"/, (...match) => {
        const url = match[1];
        return url.startsWith('http')
          ? `src="${url}"`
          : `src="${getPath(url, dirname)}"`;
      });
    });
  };
}

function getPath(url: string, dirname: string) {
  return path.isAbsolute(url)
    ? url
    : path.join(process.cwd(), dirname, url);
}
