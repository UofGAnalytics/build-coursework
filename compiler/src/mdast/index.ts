import { Parent } from 'mdast';
// @ts-expect-error
import headings from 'remark-autolink-headings';
import directive from 'remark-directive';
import frontmatter from 'remark-frontmatter';
import gfm from 'remark-gfm';
import markdown from 'remark-parse';
import slug from 'remark-slug';
// @ts-expect-error
import toVFile from 'to-vfile';
import unified from 'unified';

import { Context } from '../context';
import { aliasDirectiveToSvg } from '../latex/directive-to-svg';
import { createSvg } from '../utils/icons';
import { boxouts } from './boxouts';
import { codeBlocks } from './code-blocks';
import { embedAssetUrl } from './embed-asset-url';
import { images } from './images';
import { moveAnswersToEnd } from './move-answers-to-end';
import { youtubeVideos } from './youtube-videos';

export async function mdastPhase(
  md: string,
  ctx: Context,
  targetPdf?: boolean
) {
  // https://github.com/unifiedjs/unified
  // convert markdown to syntax tree: complex transforms
  // should be more robust and straightforward
  const processor = unified()
    // third-party plugins:
    .use(markdown)
    .use(directive)
    .use(gfm)
    .use(frontmatter)
    .use(slug)
    .use(headings, {
      content: createSvg('link-icon'),
      linkProperties: { className: 'link' },
    })
    // custom plugins:
    .use(embedAssetUrl)
    .use(youtubeVideos)
    .use(aliasDirectiveToSvg, ctx)
    .use(codeBlocks, ctx)
    .use(boxouts)
    .use(images);

  if (targetPdf) {
    processor.use(moveAnswersToEnd);
  }

  const file = toVFile({ contents: md });
  const parsed = processor.parse(file);
  return processor.run(parsed, file) as Promise<Parent>;
}
