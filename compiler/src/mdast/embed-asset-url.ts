import path from 'path';

import { Literal, Root } from 'mdast';
import { visit } from 'unist-util-visit';
import { remove } from 'unist-util-remove';

import { Context } from '../context';
import { LeafDirective } from 'mdast-util-directive';

export function embedAssetUrl(ctx: Context) {
  return async (tree: Root) => {
    let activeDir = '';

    // nodes need to be visited in the correct order
    // to derive the document directory
    visit(tree, (node, index, parent) => {
      // to ensure relative paths to assets across multiple .Rmd files
      if (node.type === 'leafDirective' && node.name === 'directory') {
        const firstChild = node.children[0] as Literal;
        activeDir = firstChild.value || '';
      }

      if (node.type === 'image') {
        const url = getPath(node.url, activeDir, ctx);
        node.url = url;
      }

      // also fix for browser template
      if (node.type === 'leafDirective' && node.name === 'browser') {
        const firstChild = node.children[0] as Literal;
        firstChild.value = getPath(firstChild.value, activeDir, ctx);
      }

      // also fix for raw html nodes sometimes output by knitr
      if (node.type === 'html') {
        const props = getProps(node.value);
        if (props !== null && props.src) {
          const { src, ...otherProps } = props;
          Object.assign(node, {
            type: 'image',
            url: getPath(src, activeDir, ctx),
            value: '',
            data: otherProps,
          });
        }
      }
    });

    // remove the directory leafDirective node from the tree
    remove(tree, (node) => {
      if (node.type === 'leafDirective') {
        const directive = node as LeafDirective;
        return directive.name === 'directory';
      }
      return false;
    });
  };
}

function getPath(url: string, dirname: string, ctx: Context) {
  if (ctx.options.noEmbedAssetUrl) {
    return url;
  }
  if (path.isAbsolute(url) || url.startsWith('http')) {
    return url;
  }
  // pythons matplotlib appears to assign plot images a path
  // relative to the project root, whereas all other libraries use
  // an absolute path.
  if (url.startsWith('cache')) {
    return path.join(ctx.cacheDir, url.replace('cache', ''));
  }
  return path.join(dirname, url);
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
