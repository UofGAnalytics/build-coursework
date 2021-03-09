import unified from 'unified';
import rehype from 'rehype-parse';
import stringify from 'rehype-stringify';
import { document, Image } from './dom-stubs';
import SandboxedModule from 'sandboxed-module';

const pdfjsLib = SandboxedModule.require('pdfjs-dist/es5/build/pdf', {
  globals: { document, Image, console, process },
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

async function formatSvg(str: string) {
  // console.log(str);
  const processor = unified()
    .use(rehype, { fragment: true })
    .use(stringify);
  return processor.parse(str.replace(/svg:/g, ''));
}

function isPdfTexDocument(_info: Object = {}) {
  const info = _info as { Producer?: string };
  const producer = info['Producer'] || '';
  return producer.startsWith('pdfTeX');
}
