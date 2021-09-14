import { Parent } from 'mdast';
// @ts-expect-error
import normalizeHeadings from 'mdast-normalize-headings';
import headings from 'remark-autolink-headings';
import directive from 'remark-directive';
import footnotes from 'remark-footnotes';
import frontmatter from 'remark-frontmatter';
import gfm from 'remark-gfm';
import markdown from 'remark-parse';
import slug from 'remark-slug';
// @ts-expect-error
import toVFile from 'to-vfile';
import unified from 'unified';
import { VFile } from 'vfile';

import { Context } from '../context';
import { aliasDirectiveToSvg } from '../latex/directive-to-svg';
import { createSvg } from '../utils/icons';
import { boxouts } from './boxouts';
import { codeBlocks } from './code-blocks';
import { embedAssetUrl } from './embed-asset-url';
import { images } from './images';
import { pagebreaks } from './pagebreaks';
import { youtubeVideos } from './youtube-videos';

export async function mdastPhase(file: VFile, ctx: Context) {
  // https://github.com/unifiedjs/unified
  // convert markdown to syntax tree: complex transforms
  // should be more robust and straightforward
  const processor = unified()
    // third-party plugins:
    .use(markdown)
    .use(directive)
    .use(gfm)
    .use(frontmatter)
    .use(footnotes)
    // .use(sectionize)
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
    .use(images)
    .use(pagebreaks);

  const parsed = processor.parse(file) as Parent;
  return processor.run(parsed, file) as Promise<Parent>;
}
