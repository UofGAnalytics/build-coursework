import path from 'path';

import { HTML, Image, Literal, Root } from 'mdast';
// import { Node } from 'unist';
import { visit } from 'unist-util-visit';

// import { VFile } from 'vfile';

// import { failMessage } from '../utils/message';

export function embedAssetUrl() {
  let activeDir = '';

  return async (tree: Root) => {
    // const dirname = file.dirname || '';
    // if (dirname === undefined) {
    //   failMessage(file, `File dirname is undefined`);
    //   return;
    // }

    // nodes need to be visited in the correct order
    // to derive the document directory
    visit(tree, (node, index, parent) => {
      if (node.type === 'textDirective' && node.name === 'directory') {
        const firstChild = node.children[0] as Literal;
        activeDir = firstChild.value || '';
        const parentChildren = parent?.children || [];
        parentChildren.splice(index || 0, 1);
      }

      if (node.type === 'image') {
        node.url = getPath(node.url, activeDir);
      }

      // also fix for raw html nodes sometimes output by knitr
      if (node.type === 'html') {
        const props = getProps(node.value);
        if (props !== null && props.src) {
          const { src, ...otherProps } = props;
          Object.assign(node, {
            type: 'image',
            url: getPath(src, activeDir),
            value: '',
            data: otherProps,
          });
        }
      }
    });

    // visit(tree, 'textDirective', (node) => {
    //   if (node.name === 'directory') {
    //     const firstChild = node.children[0] as Literal;
    //     activeDir = firstChild.value || '';
    //   }
    // });

    // visit(tree, 'image', (node: Image) => {
    //   // console.log(activeDir);
    //   node.url = getPath(node.url, activeDir);
    // });

    // also fix for raw html nodes sometimes output by knitr
    // visit(tree, 'html', (node: HTML) => {
    //   const props = getProps(node.value);
    //   if (props !== null && props.src) {
    //     const { src, ...otherProps } = props;
    //     Object.assign(node, {
    //       type: 'image',
    //       url: getPath(src, activeDir),
    //       value: '',
    //       data: otherProps,
    //     });
    //   }
    // });
  };
}

function getPath(url: string, dirname: string) {
  return path.isAbsolute(url) || url.startsWith('http')
    ? url
    : path.join(dirname, url);
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
