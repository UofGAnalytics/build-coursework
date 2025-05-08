import path from 'path';

import { encode as base46Encode } from 'base64-arraybuffer';
import { Element, Properties } from 'hast';
import sizeOf from 'image-size';
import mimes from 'mime';
import fetch from 'node-fetch';
import { toVFile } from 'to-vfile';
// import { optimize } from 'svgo';
import { Parent } from 'unist';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

import { Context } from '../context';
// import { pdfToSvg } from '../pdf/pdf-to-svg';
import { cacheToFile } from '../utils/cache-to-file';
import { getSvgHast } from '../utils/get-svg-hast';
import { failMessage } from '../utils/message';
import { readFile, rehypeParser } from '../utils/utils';

export function inlineRelativeAssets(ctx: Context) {
  return async (tree: Element, file: VFile) => {
    const transformations: Promise<void>[] = [];
    const loadedScripts: string[] = [];

    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'img') {
        transformations.push(embedFile(node, file, ctx));
      }
      if (node.tagName === 'script' && node.properties?.src) {
        transformations.push(
          embedScript(node, index, parent, loadedScripts),
        );
      }
    });

    await Promise.all(transformations);
  };
}

async function embedFile(node: Element, file: VFile, ctx: Context) {
  const src = getImageSrc(node);
  const parsed = path.parse(src);
  try {
    switch (parsed.ext) {
      case '.png':
      case '.jpg':
      case '.jpeg':
      case '.gif':
        return await embedImage(node, ctx, file);
      case '.svg':
        return await embedSvg(node, ctx);
      case '.html':
        return await embedHtml(node);
      case '.pdf':
        // return await embedPdfSvg(node);
        throw new Error(
          `Unhandled file extension: .pdf (convert to .svg)`,
        );
      default:
        throw new Error(
          `"${src}" has unhandled file extension. Should be one of: .png, .jpg, .jpeg, .gif, .svg, .html`,
        );
    }
  } catch (_err) {
    console.log(_err);
    const err = _err as Error;
    failMessage(file, err?.message || '', node.position);
  }
}

async function embedImage(node: Element, ctx: Context, file: VFile) {
  const src = getImageSrc(node);
  const mime = mimes.getType(path.extname(src));
  try {
    const image = await getImage(src, ctx);
    const { width } = sizeOf(Buffer.from(image, 'base64'));
    node.properties = {
      ...node.properties,
      src: `data:${mime};base64,${image}`,
      style: [`max-width: ${width}px`],
    };
  } catch (err) {
    console.log(err);
    failMessage(file, `Image not found: ${src}`);
  }
}

async function embedSvg(imgNode: Element, ctx: Context) {
  const src = getImageSrc(imgNode);
  const contents = await readFile(src);
  const idx = contents.indexOf('<svg');
  const svg = idx === -1 ? contents : contents.slice(idx);
  // const optimised = optimize(svg, { multipass: true }).data;
  // const svgNode = getAssetHast(svg) as Element;

  const svgNode = getSvgHast(svg);
  const svgProperties = svgNode.properties || {};

  // helps to ensure the svg is responsive
  delete svgProperties.width;
  delete svgProperties.height;

  const className = 'knitr-svg';
  const properties = {
    ...imgNode.properties,
    ...svgProperties,
    className: [
      className,
      ...getNodeClassNames(imgNode, className),
      ...getNodeClassNames(svgNode, className),
    ],
  } as Properties;

  delete properties.src;

  Object.assign(imgNode, svgNode, { properties });
}

function getNodeClassNames(node: Element, removeClass: string) {
  const classes = node.properties?.className;
  if (typeof classes === 'string' && classes !== removeClass) {
    return [classes];
  }
  if (Array.isArray(classes)) {
    return classes.map((x) => String(x)).filter((s) => s !== removeClass);
  }
  return [];
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
  try {
    return await readFile(src, 'base64');
  } catch (err: any) {
    if ((err?.message || '').startsWith('Error: ENOENT')) {
      return '';
    }
    throw err;
  }
}

async function getImageDataFromWeb(src: string) {
  const response = await fetch(src);
  const buffer = await response.arrayBuffer();
  return base46Encode(buffer);
}

// async function embedPdfSvg(imgNode: Element) {
//   const src = getImageSrc(imgNode);
//   const svgNode = (await pdfToSvg(src)) as Element;
//   console.log('hey!');
//   console.log(svgNode);

//   const properties = {
//     ...imgNode.properties,
//     ...svgNode.properties,
//   } as Properties;

//   delete properties.src;

//   Object.assign(imgNode, svgNode, { properties });
// }

async function embedHtml(imgNode: Element) {
  const src = getImageSrc(imgNode);
  const value = await readFile(src);
  const vfile = toVFile({ value });
  const parsed = rehypeParser().parse(vfile) as Parent;

  Object.assign(imgNode, {
    tagName: 'div',
    properties: {
      className: 'interactive-element',
    },
    children: parsed.children,
  });
}

async function embedScript(
  node: Element,
  index: number | undefined,
  parent: Parent | undefined,
  loadedScripts: string[],
) {
  if (!node.properties?.src) {
    return;
  }

  const src = node.properties.src as string;

  if (loadedScripts.includes(src)) {
    // script already inlined, remove tag
    const parentChildren = parent?.children || [];
    parentChildren.splice(index || 0, 1);
    return;
  }

  loadedScripts.push(src);

  delete node.properties.src;
  const response = await fetch(src);
  const value = await response.text();

  node.children = [
    {
      type: 'text',
      value: `// ${src}\n${value}\n`,
    },
  ];
}
