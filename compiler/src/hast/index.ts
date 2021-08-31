import { Parent as HastParent } from 'hast';
import { Parent as MDastParent } from 'mdast';
import rehypeRaw from 'rehype-raw';
import remark2rehype from 'remark-rehype';
import unified from 'unified';
import { VFile } from 'vfile';

import { Context } from '../context';
// import { moveAnswersToEnd } from '../mdast/move-answers-to-end';
import { embedAssets } from './embed-assets';
import { responsiveTables } from './responsive-tables';

export async function hastPhase(
  mdast: MDastParent,
  ctx: Context,
  file: VFile,
  targetPdf?: boolean
) {
  const processor = unified()
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(responsiveTables);

  // if (targetPdf) {
  //   // although an mdast transform, has been put here as
  //   // it needs the full document to work correctly
  //   processor.use(moveAnswersToEnd);
  // }

  if (!ctx.options.noEmbedAssets) {
    processor.use(embedAssets, ctx);
  }

  return processor.run(mdast, file) as Promise<HastParent>;
}
