import { Parent } from 'mdast';
import unified from 'unified';
import { VFile } from 'vfile';

import { boxouts } from './boxouts';
import { moveAnswersToEnd } from './move-answers-to-end';

export async function combinedMdastPhase(
  mdast: Parent,
  file: VFile,
  targetPdf?: boolean
) {
  const processor = unified().use(boxouts);

  if (targetPdf) {
    processor.use(moveAnswersToEnd);
  }

  return processor.run(mdast, file) as Promise<Parent>;
}
