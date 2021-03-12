import { Node as HastNode } from 'hast';
import unified from 'unified';
import rehype from 'rehype-parse';
import stringify from 'rehype-stringify';
import SandboxedModule from 'sandboxed-module';
import visit from 'unist-util-visit';

import {
  document,
  Image,
  Element,
  // @ts-expect-error
} from './domstubs';

// inject globals into pdf.js in a non-leaky way
const pdfjsLib = SandboxedModule.require('pdfjs-dist/es5/build/pdf', {
  globals: { document, Image, Element, console, process },
});

export async function texPdfToSvg(filePath: string) {
  const doc = await pdfjsLib.getDocument({
    url: filePath,
    fontExtraProperties: true,
    // cMapUrl: '../node_modules/pdfjs-dist/cmaps/',
    // cMapPacked: true,
  }).promise;

  const metadata = await doc.getMetadata();
  if (!isPdfTexDocument(metadata.info)) {
    throw new Error('unhandled file extension: .pdf');
  }

  const page = await doc.getPage(1);
  const opList = await page.getOperatorList();
  const viewport = page.getViewport({ scale: 1.0 });
  const svgGfx = new pdfjsLib.SVGGraphics(page.commonObjs, page.objs);
  svgGfx.embedFonts = true;

  const svg = await svgGfx.getSVG(opList, viewport);
  return formatSvg(svg.toString());
}

function isPdfTexDocument(_info: Object = {}) {
  const info = _info as { Producer?: string };
  const producer = info['Producer'] || '';
  return producer.startsWith('pdfTeX');
}

async function formatSvg(str: string) {
  const processor = unified()
    .use(rehype, { fragment: true })
    .use(addWrapper)
    .use(stringify);
  const parsed = processor.parse(str.replace(/svg:/g, ''));
  return processor.run(parsed);
}

export function addWrapper() {
  return (tree: HastNode) => {
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
    // console.log(tree);
    // return {
    //   type: 'root',
    //   children: [
    //     {
    //       type: 'element',
    //       tagName: 'div',
    //       properties: {
    //         className: 'math',
    //       },
    //       children: tree.children as HastNode[],
    //     },
    //   ],
    // };
  };
}
