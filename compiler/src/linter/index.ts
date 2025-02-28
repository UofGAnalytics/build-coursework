import lintAltText from '@double-great/remark-lint-alt-text';
// @ts-expect-error
import lintLinkText from '@mapbox/remark-lint-link-text';
// import dictionary from 'dictionary-en-gb';
// import remark2retext from 'remark-retext';
// import english from 'retext-english';
// import spell from 'retext-spell';
import { unified } from 'unified';
import { Node } from 'unist';
import { VFile } from 'vfile';

import { Context } from '../context';
import { assertAssetExists } from './assert-asset-exists';
import { assertColumnStructure } from './assert-columns';
import { assertNoH1 } from './assert-no-h1';
import { assertProgramSwitcherStructure } from './assert-program-switcher';
import { assertTaskAnswerStructure } from './assert-task-answer';
import { assertVideoAttributes } from './assert-video-attributes';
import { assertWeblinkTarget } from './assert-weblink-target';
import { lintLatex } from './lint-latex';
import { printReport, reportHasFatalErrors } from './report';
import { Root } from 'mdast';

export function reportErrors(files: VFile[], ctx: Context) {
  if (!ctx.options.noReport) {
    printReport(files, ctx);
  }
  if (reportHasFatalErrors(files)) {
    if (ctx.options.noReport) {
      printReport(files, {
        ...ctx,
        options: {
          ...ctx.options,
          reportOnlyErrors: true,
        },
      });
    }
    console.log('Report has fatal errors');
    if (ctx.options.force) {
      console.log('Compiling using force option...');
    } else {
      process.exit(1);
    }
  }
}

export async function createReport(
  file: VFile,
  mdast: Node,
  ctx: Context,
) {
  const processor = unified()
    // .use(() => (tree) => {
    //   console.dir(tree, { depth: null });
    // })
    .use(assertAssetExists)
    .use(assertVideoAttributes)
    .use(assertTaskAnswerStructure)
    .use(assertProgramSwitcherStructure)
    .use(assertColumnStructure)
    .use(assertWeblinkTarget)
    .use(assertNoH1)
    .use(lintLatex)
    // @ts-expect-error
    .use(lintAltText)
    .use(lintLinkText);

  // if (ctx.options.spelling) {
  //   const retextProcessor = unified()
  //     .use(english)
  //     .use(spell, { dictionary, max: 1 });
  //   processor.use(remark2retext, retextProcessor);
  // }

  await processor.run(mdast as Root, file);
}
