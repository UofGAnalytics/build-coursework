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
      const props = getProps(node.value);
      if (props !== null && props.src) {
        const { src, ...otherProps } = props;
        Object.assign(node, {
          type: 'image',
          url: getPath(src, dirname),
          value: '',
          data: otherProps,
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

function getProps(value: string) {
  const matchImg = value.match(/^<img.*?src="(.+?)".*?>$/);
  if (matchImg !== null) {
    return propsToObject(value.slice(5, -1));
  }
  const matchPdf = value.match(/^<embed.*?src="(.+?)".*?>$/);
  if (matchPdf !== null) {
    return propsToObject(value.slice(7, -1));
  }
  return null;
}

function propsToObject(str: string) {
  return str
    .split(/(\w+)="(.*?)"/)
    .filter((s) => s.trim() !== '')
    .reduce((acc: Record<string, string>, value, idx, arr) => {
      if (idx % 2 === 1) {
        const key = arr[idx - 1];
        acc[key] = value;
      }
      return acc;
    }, {});
}
