import path from 'path';

import { Parent as HastParent } from 'hast';
import doc from 'rehype-document';
// @ts-expect-error
import format from 'rehype-format';
import stringify from 'rehype-stringify';
import unified from 'unified';

import { Context } from '../context';
import { Unit } from '../course/types';
import { readFile } from '../utils/utils';
import { htmlWrapper } from './wrapper';

export async function htmlPhase(
  hast: HastParent,
  unit: Unit,
  ctx: Context,
  targetPdf?: boolean
) {
  const processor = unified().use(format).use(stringify);

  // TODO: try to get this inside template workspace
  if (!ctx.options.noWrapper) {
    processor.use(htmlWrapper, unit.titles, hast);
  }

  if (!ctx.options.noDoc) {
    // TODO: libraryFile helper
    const templateCss = await readFile(
      path.join(__dirname, 'template.css')
    );
    const templateJs = await readFile(
      path.join(__dirname, 'template.js2')
    );
    processor.use(doc, {
      title: unit.titles.docTitle,
      style: `\n${templateCss}\n`,
      script: `\n${templateJs}\n`,
    });
  }

  const result = await processor.run(hast);

  return processor.stringify(result);
}
