import { Parent as HastParent } from 'hast';
import { Parent as MDastParent } from 'mdast';
import remark2rehype from 'remark-rehype';
import unified from 'unified';

import { Context } from '../context';
import { Unit } from '../course/types';
import { embedAssets } from './embed-assets';
import { responsiveTables } from './responsive-tables';

export async function hastPhase(
  mdast: MDastParent,
  unit: Unit,
  ctx: Context,
  targetPdf?: boolean
) {
  const processor = unified()
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(responsiveTables);

  if (!ctx.options.noEmbedAssets) {
    processor.use(embedAssets, ctx);
  }

  return processor.run(mdast) as Promise<HastParent>;
}
