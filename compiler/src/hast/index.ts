import { Root } from 'mdast';
import rehypeRaw from 'rehype-raw';
import remark2rehype from 'remark-rehype';
import { unified } from 'unified';
import { VFile } from 'vfile';

import { Context } from '../context';
import { inlineRelativeAssets } from './inline-files';
import { responsiveTables } from './responsive-tables';

export async function hastPhase(
  mdast: Root,
  ctx: Context,
  file: VFile,
  targetPdf?: boolean
) {
  const processor = unified()
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(responsiveTables);

  if (!ctx.options.noEmbedAssets) {
    processor.use(inlineRelativeAssets, ctx);
  }

  return processor.run(mdast, file);
}
