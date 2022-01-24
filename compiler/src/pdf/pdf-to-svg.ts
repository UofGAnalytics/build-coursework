import { Blob } from 'buffer';

import { Properties, Root } from 'hast';
import rehype from 'rehype-parse';
import stringify from 'rehype-stringify';
import SandboxedModule from 'sandboxed-module';
import { optimize } from 'svgo';
import { unified } from 'unified';
import { Parent } from 'unist';
import { visit } from 'unist-util-visit';

// @ts-expect-error
import { Element, Image, document } from './domstubs';

// inject globals into pdf.js in a non-leaky way
const pdfjsLib = SandboxedModule.require('pdfjs-dist/legacy/build/pdf', {
  globals: { document, Image, Element, Blob, console, process, URL },
});

export async function pdfToSvg(filePath: string) {
  const doc = await pdfjsLib.getDocument({
    url: filePath,
    fontExtraProperties: true,
    verbosity: 0,
    // cMapUrl: '../node_modules/pdfjs-dist/cmaps/',
    // cMapPacked: true,
  }).promise;

  // may come in handy again...
  // const metadata = await doc.getMetadata();
  // if (!isPdfTexDocument(metadata.info)) {
  //   throw new Error('Unhandled pdf file: was not produced by PdfTeX');
  // }

  const page = await doc.getPage(1);
  const opList = await page.getOperatorList();
  const viewport = page.getViewport({ scale: 1.0 });
  const svgGfx = new pdfjsLib.SVGGraphics(page.commonObjs, page.objs);
  svgGfx.embedFonts = true;
  const svg = await svgGfx.getSVG(opList, viewport);
  const result = await formatSvg(svg.toString());
  return result;
}

// function isPdfTexDocument(info: Record<string, string> = {}) {
//   return info['Producer']?.startsWith('pdfTeX');
// }

async function formatSvg(_str: string) {
  const str = _str.replace(/svg:/g, '');
  const optimised = optimize(str, { multipass: true });
  if (optimised.modernError) {
    throw optimised.modernError;
  }
  const processor = unified()
    .use(rehype, { fragment: true })
    .use(addWrapper)
    .use(stringify);
  const parsed = processor.parse(optimised.data);
  const transformed = (await processor.run(parsed)) as Parent;
  return transformed.children[0];
}

function addWrapper() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'svg') {
        const properties = node.properties || {};
        node.properties = {
          // width: properties.width,
          // height: properties.height,
          viewBox: getViewBox(properties),
          className: 'pdftex',
        };
      }
    });
  };
}

function getViewBox(properties: Properties) {
  if (properties.viewBox) {
    return properties.viewBox;
  }
  return `0 0 ${properties.width} ${properties.height}`;
}
