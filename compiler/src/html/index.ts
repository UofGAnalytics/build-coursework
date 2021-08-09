import path from 'path';

import { Parent as HastParent } from 'hast';
import { Parent as MdastParent } from 'mdast';
import doc, { Options } from 'rehype-document';
// @ts-expect-error
import format from 'rehype-format';
import stringify from 'rehype-stringify';
import unified from 'unified';

import { Context } from '../context';
import { Unit } from '../course/types';
import { getLibraryDir, readFile } from '../utils/utils';
import { pdfWrapper } from './pdf';
import { htmlWrapper } from './wrapper';

export async function htmlPhase(
  hast: HastParent,
  mdast: MdastParent,
  unit: Unit,
  ctx: Context,
  targetPdf?: boolean
) {
  const processor = unified().use(format).use(stringify);

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

      processor.use(htmlWrapper, mdast);
    } else {
      processor.use(pdfWrapper);
    }

    processor.use(doc, docOptions);
  }

  const result = await processor.run(hast);

  return processor.stringify(result);
}
