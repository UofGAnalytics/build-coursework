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
      node.url = getPath(node.url, dirname);
    });

    // also fix for raw html nodes sometimes output by knitr
    visit<Text>(tree, ['html'], (node) => {
      const match = node.value.match(/^<img.*?src="(.+?)".*?>$/);
      if (match !== null) {
        Object.assign(node, {
          type: 'image',
          url: getPath(match[1], dirname),
        });
      }
    });
  };
}

function getPath(url: string, dirname: string) {
  return path.isAbsolute(url) || url.startsWith('http')
    ? url
    : path.join(process.cwd(), dirname, url);
}
