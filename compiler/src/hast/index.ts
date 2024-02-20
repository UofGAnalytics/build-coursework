import { Root } from 'mdast';
import rehypeRaw from 'rehype-raw';
import remark2rehype from 'remark-rehype';
import slug from 'rehype-slug';
import headings from 'rehype-autolink-headings';
import { unified } from 'unified';
import { VFile } from 'vfile';

import { Context } from '../context';
import { createSvg } from '../utils/icons';
import { inlineRelativeAssets } from './inline-files';
import { responsiveTables } from './responsive-tables';

export async function hastPhase(
  mdast: Root,
  ctx: Context,
  file: VFile,
  targetPdf?: boolean,
) {
  const processor = unified()
    .use(remark2rehype, { allowDangerousHtml: true })
    // .use(() => (tree) => {
    //   console.dir(tree.children[0], { depth: null });
    // })
    .use(rehypeRaw)
    .use(responsiveTables)
    .use(slug)
    .use(headings, {
      content: createSvg('link-icon') as any,
      properties: { className: 'link' },
    });

  if (!ctx.options.noEmbedAssets) {
    processor.use(inlineRelativeAssets, ctx);
  }

  return processor.run(mdast, file);
}
