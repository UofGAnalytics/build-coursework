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
import { markdownPhase } from '../markdown';
import { mdastPhase } from '../mdast';
import { assertAssetExists } from './assert-asset-exists';
import { assertTaskAnswerStructure } from './assert-task-answer';
import { assertVideoAttributes } from './assert-video-attributes';
import { assertWeblinkTarget } from './assert-weblink-target';
import { lintLatex } from './lint-latex';
import { printReport, reportHasFatalErrors } from './report';

export async function linter({ files }: Unit, ctx: Context) {
  await Promise.all(files.map((file) => createReport(file, ctx)));

  if (!ctx.options.noReport) {
    printReport(files, ctx);
  }
  if (reportHasFatalErrors(files, ctx)) {
    if (ctx.options.noReport) {
      printReport(files, {
        ...ctx,
        options: {
          ...ctx.options,
          reportOnlyErrors: true,
        },
      });
    }
    // throw new Error('Report has fatal errors');
  }
}

async function createReport(file: VFile, ctx: Context) {
  const contents = file.contents as string;
  const md = await markdownPhase(contents, ctx);
  const mdast = await mdastPhase(md, ctx);

  const processor = unified()
    .use(assertAssetExists)
    .use(assertVideoAttributes)
    .use(assertTaskAnswerStructure)
    .use(assertWeblinkTarget)
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
