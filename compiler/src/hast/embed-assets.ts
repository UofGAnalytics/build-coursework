import path from 'path';

import { Element, Properties } from 'hast';
import mimes from 'mime/lite';
import fetch from 'node-fetch';
import { Node } from 'unist';
import visit from 'unist-util-visit';
import { VFile } from 'vfile';

import { Context } from '../context';
import { texPdfToSvg } from '../latex/pdf-to-svg';
import { cacheToFile } from '../utils/cache-to-file';
import { getAssetHast } from '../utils/get-asset-hast';
import { failMessage } from '../utils/message';
import { readFile } from '../utils/utils';

export function embedAssets(ctx: Context) {
  async function embed(node: Element, file: VFile) {
    const src = getImageSrc(node);
    const parsed = path.parse(src);
    try {
      switch (parsed.ext) {
        case '.png':
        case '.jpg':
        case '.gif':
          return embedImage(node, ctx, file);
        case '.svg':
          return embedPlotSvg(node, ctx);
        case '.pdf':
          return embedTexPdfSvg(node);
        default:
          throw new Error(`Unhandled file extension: ${parsed.ext}`);
      }
    } catch (err) {
      failMessage(file, err.message, node.position);
    }
  }
  return async (tree: Node, file: VFile) => {
    const transformations: Promise<void>[] = [];
    visit<Element>(tree, 'element', (node) => {
      if (node.tagName === 'img') {
        transformations.push(embed(node, file));
      }
    });
    await Promise.all(transformations);
  };
}

async function embedImage(node: Element, ctx: Context, file: VFile) {
  const src = getImageSrc(node);
  const mime = mimes.getType(path.extname(src));
  try {
    const image = await getImage(src, ctx);
    node.properties = {
      ...node.properties,
      src: `data:${mime};base64,${image}`,
    };
  } catch (err) {
    failMessage(file, `Image not found: ${src}`);
  }
}

async function embedPlotSvg(imgNode: Element, ctx: Context) {
  const src = getImageSrc(imgNode);
  const contents = await readFile(src);
  const idx = contents.indexOf('<svg');
  const svg = idx === -1 ? contents : contents.slice(idx);
  const svgNode = getAssetHast(svg) as Element;

  const properties = {
    ...svgNode.properties,
    ...imgNode.properties,
  } as Properties;

  delete properties.src;

  Object.assign(imgNode, svgNode, { properties });
}

function getImageSrc(node: Element) {
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
  }
  return readFile(src, 'base64');
}

async function getImageDataFromWeb(src: string) {
  const response = await fetch(src);
  const buffer = await response.buffer();
  return buffer.toString('base64');
}

async function embedTexPdfSvg(imgNode: Element) {
  const src = getImageSrc(imgNode);
  const svgNode = (await texPdfToSvg(src)) as Element;

  const properties = {
    ...svgNode.properties,
    ...imgNode.properties,
  } as Properties;

  delete properties.src;

  Object.assign(imgNode, svgNode, { properties });
}
