import path from 'path';

import { Parent as HastParent } from 'hast';
import { startCase } from 'lodash';
import { Parent as MdastParent } from 'mdast';
import doc, { Options } from 'rehype-document';
// @ts-expect-error
import format from 'rehype-format';
import stringify from 'rehype-stringify';
import unified from 'unified';
import { VFile } from 'vfile';

import { Context } from '../context';
import { Unit } from '../course/types';
import { getLibraryDir, readFile } from '../utils/utils';
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
  const processor = unified()
    .use(format)
    .use(stringify, { allowDangerousHtml: true });

  if (!ctx.options.noDoc) {
    const templateCss = await readFile(
      path.join(getLibraryDir(), 'template.css')
    );
    const docOptions: Options = {
      title: unit.titles.docTitle,
      style: `\n${templateCss}\n`,
    };

    if (!targetPdf) {
      const templateJs = await readFile(
        path.join(getLibraryDir(), 'template.js2')
      );
      docOptions.script = `\n${templateJs}\n`;

      processor.use(htmlWrapper, unit, mdast);
    } else {
      processor.use(pdfWrapper, unit);
    }

    processor.use(doc, docOptions);
  }

  const transformed = await processor.run(hast, file);

  const result = processor.stringify(transformed, file);

  return referenceTransform(result, ctx.refStore);
}

function referenceTransform(html: string, refStore: Context['refStore']) {
  return html.replace(/ref:\/\/(\w+)/gms, (...match) => {
    const key = match[1];
    const link = refStore[key];
    const name = startCase(link);
    return `<a href="#${link}">${name}</a>`;
  });
}
