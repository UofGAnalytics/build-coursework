import { Parent } from 'mdast';
import unified from 'unified';
import { VFile } from 'vfile';

import { Context } from '../context';
import { boxouts } from './boxouts';
import { moveAnswersToEnd } from './move-answers-to-end';

export async function combinedMdastPhase(
  mdast: Parent,
  ctx: Context,
  file: VFile,
  targetPdf?: boolean
) {
  const processor = unified().use(boxouts, ctx.refStore);

  if (targetPdf) {
    processor.use(moveAnswersToEnd);
  }

  return processor.run(mdast, file) as Promise<Parent>;
}
