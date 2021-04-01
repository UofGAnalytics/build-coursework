import rehype from 'rehype-parse';
import stringify from 'rehype-stringify';
import SandboxedModule from 'sandboxed-module';
import unified from 'unified';
import { Node } from 'unist';
import visit from 'unist-util-visit';
import { VFile } from 'vfile';

import { Context } from '../types';
// @ts-expect-error
import { Element, Image, document } from './domstubs';

// inject globals into pdf.js in a non-leaky way
const pdfjsLib = SandboxedModule.require('pdfjs-dist/es5/build/pdf', {
  globals: { document, Image, Element, console, process },
});

export async function texPdfToSvg(
  filePath: string,
  ctx: Context,
  file: VFile
) {
  const doc = await pdfjsLib.getDocument({
    url: filePath,
    fontExtraProperties: true,
    // cMapUrl: '../node_modules/pdfjs-dist/cmaps/',
    // cMapPacked: true,
  }).promise;

  const metadata = await doc.getMetadata();
  if (!isPdfTexDocument(metadata.info)) {
    throw new Error('Unhandled pdf file: was not produced by PdfTeX');
  }

  const page = await doc.getPage(1);
  const opList = await page.getOperatorList();
  const viewport = page.getViewport({ scale: 1.0 });
  const svgGfx = new pdfjsLib.SVGGraphics(page.commonObjs, page.objs);
  svgGfx.embedFonts = true;

  const svg = await svgGfx.getSVG(opList, viewport);
  return formatSvg(svg.toString());
}

function isPdfTexDocument(info: Record<string, string> = {}) {
  return info.Producer?.startsWith('pdfTeX');
}

async function formatSvg(str: string) {
  const processor = unified()
    .use(rehype, { fragment: true })
    .use(addWrapper)
    .use(stringify);
  const parsed = processor.parse(str.replace(/svg:/g, ''));
  return processor.run(parsed);
}

function addWrapper() {
  return (tree: Node) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'svg') {
        const properties = node.properties as Record<string, any>;
        node.properties = {
          width: properties.width,
          height: properties.height,
          viewBox: properties.viewBox,
          className: 'pdftex',
        };
      }
    });
  };
}
