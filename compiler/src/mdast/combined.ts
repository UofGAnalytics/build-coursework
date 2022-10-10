import { Root } from 'mdast';
import { unified } from 'unified';
import { VFile } from 'vfile';

import { Context } from '../context';
import { boxouts } from './boxouts';
import { moveAnswersToEnd } from './move-answers-to-end';
import { programSwitcher } from './program-switcher';

export async function combinedMdastPhase(
  mdast: Root,
  ctx: Context,
  file: VFile,
  targetPdf?: boolean
) {
  const processor = unified()
    .use(programSwitcher, ctx)
    .use(boxouts, ctx.refStore);

  if (targetPdf) {
    processor.use(moveAnswersToEnd);
  }

  return processor.run(mdast, file) as Promise<Root>;
}
