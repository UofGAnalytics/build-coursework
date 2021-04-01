import path from 'path';

import mimes from 'mime/lite';
import fetch from 'node-fetch';
import { Node } from 'unist';
import visit from 'unist-util-visit';
import { VFile } from 'vfile';

import { texPdfToSvg } from '../latex/pdf-to-svg';
import { Context } from '../types';
import { cacheToFile } from '../utils/cache-to-file';
import { failMessage } from '../utils/message';
import { readFile } from '../utils/utils';

export function embedAssets(ctx: Context) {
  async function embed(node: Node, file: VFile) {
    const src = getImageSrc(node);
    const parsed = path.parse(src);
    try {
      switch (parsed.ext) {
        case '.png':
        case '.jpg':
        case '.gif':
          return embedImage(node, ctx);
        case '.pdf':
          return embedTexPdfSvg(node, ctx, file);
        default:
          throw new Error(`Unhandled file extension: ${parsed.ext}`);
      }
    } catch (err) {
      failMessage(file, err.message, node.position);
    }
  }
  return async (tree: Node, file: VFile) => {
    const transformations: Promise<void>[] = [];
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img') {
        transformations.push(embed(node, file));
      }
    });
    await Promise.all(transformations);
  };
}

async function embedImage(node: Node, ctx: Context) {
  const properties = (node.properties || {}) as { src: string };
  const src = getImageSrc(node);
  const mime = mimes.getType(path.extname(src));
  const image = await getImage(src, ctx);
  node.properties = {
    ...properties,
    src: `data:${mime};base64,${image}`,
  };
}

function getImageSrc(node: Node) {
  const properties = (node.properties || {}) as { src: string };
  if (!properties.src) {
    throw new Error('Image has no src');
  }
  return properties.src;
}

async function getImage(src: string, ctx: Context) {
  if (src.startsWith('http')) {
    return cacheToFile({
      ctx,
      prefix: 'youtube',
      key: src,
      execFn: getImageDataFromWeb,
    });
  } else {
    return readFile(src, 'base64');
  }
}

async function getImageDataFromWeb(src: string) {
  const response = await fetch(src);
  const buffer = await response.buffer();
  return buffer.toString('base64');
}

async function embedTexPdfSvg(imgNode: Node, ctx: Context, file: VFile) {
  const src = getImageSrc(imgNode);
  const svgNode = await texPdfToSvg(src, ctx, file);
  const svgProps = svgNode.properties as Record<string, string>;
  const imgProps = imgNode.properties as Record<string, string>;
  const properties = { ...svgProps, ...imgProps };
  delete properties.src;
  Object.assign(imgNode, svgNode, { properties });
}
