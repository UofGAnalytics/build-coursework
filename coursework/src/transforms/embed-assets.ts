import path from 'path';
import fetch from 'node-fetch';
import { VFile } from 'vfile';
import visit from 'unist-util-visit';
import { Node, Parent } from 'unist';
import mimes from 'mime/lite';
import { readFile, checkFileExists } from '../util';
import { cacheToFile } from '../cache-to-file';
import { failMessage } from '../message';
import { texPdfToSvg } from '../latex/pdf-to-svg';

export function embedAssetUrl() {
  async function getAssetUrl(node: Node, file: VFile) {
    const url = (node.url || '') as string;
    if (!file.dirname) {
      throw new Error('VFile dirname undefined');
    }
    if (/^\.{1,2}\//.test(url)) {
      const fullPath = path.join(file.cwd, file.dirname, url);
      const exists = await checkFileExists(fullPath);
      if (!exists) {
        failMessage(file, `No asset found at ${url}`, node.position);
      } else {
        node.url = fullPath;
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

export function embedAssets(dirPath: string) {
  async function embed(node: Node, parent: Parent | undefined) {
    const src = getImageSrc(node);
    const parsed = path.parse(src);
    switch (parsed.ext) {
      case '.png':
      case '.jpg':
      case '.gif':
        return embedImage(node, dirPath);
      case '.pdf':
        return embedTexPdfSvg(node, parent);
    }
    throw new Error(`unhandled file extension: ${parsed.ext}`);
  }
  return async (tree: Node) => {
    const transformations: Promise<void>[] = [];
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'img') {
        transformations.push(embed(node, parent));
      }
    });
    await Promise.all(transformations);
  };
}

function getImageSrc(node: Node) {
  const properties = (node.properties || {}) as { src: string };
  if (!properties.src) {
    throw new Error('Image has no src');
  }
  return properties.src;
}

async function embedTexPdfSvg(imgNode: Node, parent: Parent | undefined) {
  const src = getImageSrc(imgNode);
  const svgNode = await texPdfToSvg(src);
  const properties = {
    ...(svgNode.properties as Record<string, any>),
    ...(imgNode.properties as Record<string, any>),
  };
  delete properties.src;
  Object.assign(parent, svgNode, { properties });
}

async function embedImage(node: Node, dirPath: string) {
  const properties = (node.properties || {}) as { src: string };
  const src = getImageSrc(node);
  node.properties = {
    ...properties,
    src: await getImageData(src, dirPath),
  };
}

async function getImageData(src: string, dirPath: string) {
  const mime = mimes.getType(path.extname(src));
  const image = await getImage(src, dirPath);
  return `data:${mime};base64,${image}`;
}

async function getImage(src: string, dirPath: string) {
  if (src.startsWith('http')) {
    return cacheToFile({
      dirPath,
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
