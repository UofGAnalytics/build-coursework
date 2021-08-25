// @ts-expect-error
import lintAltText from '@double-great/remark-lint-alt-text';
// @ts-expect-error
import lintLinkText from '@mapbox/remark-lint-link-text';
// @ts-expect-error
import dictionary from 'dictionary-en-gb';
// @ts-expect-error
import remark2retext from 'remark-retext';
// @ts-expect-error
import english from 'retext-english';
// @ts-expect-error
import spell from 'retext-spell';
import unified from 'unified';
import { VFile } from 'vfile';

import { Context } from '../context';
import { Unit } from '../course/types';
import { mdastPhase } from '../mdast';
import { preParsePhase } from '../pre-parse';
import { assertAssetExists } from './assert-asset-exists';
import { assertNoH1 } from './assert-no-h1';
import { assertNoKbl } from './assert-no-kbl';
import { assertNoOutWidthHeight } from './assert-no-out-width-height';
import { assertNoTexTabular } from './assert-no-tex-tabular';
import { assertTaskAnswerStructure } from './assert-task-answer';
import { assertVideoAttributes } from './assert-video-attributes';
import { assertWeblinkTarget } from './assert-weblink-target';
import { lintLatex } from './lint-latex';
import { printReport, reportHasFatalErrors } from './report';

export async function linter(unit: Unit, ctx: Context) {
  await Promise.all(
    unit.files.map((file) => createReport(file, unit, ctx))
  );
}

export function reportErrors(files: VFile[], ctx: Context) {
  if (reportHasFatalErrors(files, ctx)) {
    if (ctx.options.noReport) {
      printReport(files, {
        ...ctx,
        options: {
          ...ctx.options,
          reportOnlyErrors: true,
        },
      });
    } else {
      printReport(files, ctx);
    }
    console.log('Report has fatal errors');
    if (ctx.options.force) {
      console.log('Compiling using force option...');
    } else {
      process.exit();
    }
  }
}

async function createReport(file: VFile, unit: Unit, ctx: Context) {
  const preParsed = preParsePhase(file);
  const contents = preParsed.contents as string;

  // simple regex tests
  assertNoTexTabular(contents, file);
  assertNoKbl(contents, file);
  assertNoOutWidthHeight(contents, file);

  const mdast = await mdastPhase(contents, unit, ctx);

  const processor = unified()
    .use(assertAssetExists)
    .use(assertVideoAttributes)
    .use(assertTaskAnswerStructure)
    .use(assertWeblinkTarget)
    .use(assertNoH1)
    .use(lintLatex)
    .use(lintAltText)
    .use(lintLinkText);

  if (ctx.options.spelling) {
    const retextProcessor = unified()
      .use(english)
      .use(spell, { dictionary, max: 1 });
    processor.use(remark2retext, retextProcessor);
  }

  await processor.run(mdast, file);
}
