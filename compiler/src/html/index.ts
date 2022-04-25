import path from 'path';

import { Parent as HastParent, Root } from 'hast';
import startCase from 'lodash/startCase.js';
import { Parent as MdastParent } from 'mdast';
import doc, { Options } from 'rehype-document';
import format from 'rehype-format';
import stringify from 'rehype-stringify';
import { unified } from 'unified';
import { VFile } from 'vfile';

import { Context } from '../context';
import { Unit } from '../course/types';
import { getTemplateDir, readFile } from '../utils/utils';
import { pdfWrapper } from './pdf';
import { htmlWrapper } from './wrapper';

export async function htmlPhase(
  hast: HastParent,
  mdast: MdastParent,
  file: VFile,
  unit: Unit,
  ctx: Context,
  targetPdf?: boolean
) {
  const processor = unified().use(stringify, { allowDangerousHtml: true });

  if (ctx.options.format) {
    // hangs in some scenarios so off by default, useful in tests
    processor.use(format);
  }

  if (!ctx.options.noDoc) {
    const cssPath = path.join(getTemplateDir(), 'template.css');
    const docOptions: Options = {
      title: unit.titles.docTitle,
      style: `\n${await readFile(cssPath)}\n`,
    };

    if (!targetPdf) {
      const jsPath = path.join(getTemplateDir(), 'template.js2');
      docOptions.script = `\n${await readFile(jsPath)}\n`;
      processor.use(htmlWrapper, unit, mdast, ctx);
    } else {
      processor.use(pdfWrapper, unit, ctx);
    }

    processor.use(doc, docOptions);
  }

  const transformed = await processor.run(hast as Root, file);

  const result = processor.stringify(transformed, file);

  return postTransforms(result, ctx);
}

function postTransforms(html: string, ctx: Context) {
  let result = '';
  result = referenceTransform(html, ctx.refStore);
  return result;
}

function referenceTransform(html: string, refStore: Context['refStore']) {
  return html.replace(/ref:\/\/(\w+)/gms, (...match) => {
    const key = match[1];
    const link = refStore[key];
    const name = startCase(link);
    return `<a href="#${link}">${name}</a>`;
  });
}
