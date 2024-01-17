import directive from 'remark-directive';
import frontmatter from 'remark-frontmatter';
import gfm from 'remark-gfm';
import markdown from 'remark-parse';
import { unified } from 'unified';
import { VFile } from 'vfile';

import { Context } from '../context';
import { aliasDirectiveToLatexSvg } from '../latex/directive-to-svg';
import { browserWindow } from './browser-window';
import { codeBlocks } from './code-blocks';
import { columns } from './columns';
import { embedAssetUrl } from './embed-asset-url';
import { gitGraph } from './gitgraph';
import { images } from './images';
import { pagebreaks } from './pagebreaks';
import { removeEmptyParagraphs } from './remove-empty-paragraphs';
import { styledTerminal } from './styled-terminal';
import { textFile } from './text-file';
import { youtubeVideos } from './youtube-videos';
import { aliasDirectiveToCode } from '../code/alias-directive-to-code';

export async function mdastPhase(file: VFile, ctx: Context) {
  // https://github.com/unifiedjs/unified
  // convert markdown to syntax tree: complex transforms
  // should be more robust and straightforward
  const processor = unified()
    // third-party plugins:
    .use(markdown)
    .use(directive)
    .use(frontmatter)
    .use(gfm)
    // custom plugins:
    // .use(() => (tree) => {
    //   console.dir(tree, { depth: null });
    // })
    .use(columns)
    .use(embedAssetUrl, ctx)
    .use(youtubeVideos)
    .use(aliasDirectiveToCode, ctx)
    .use(aliasDirectiveToLatexSvg, ctx)
    .use(removeEmptyParagraphs)
    .use(gitGraph)
    .use(textFile)
    .use(browserWindow)
    .use(codeBlocks, ctx)
    .use(styledTerminal)
    .use(images, ctx)
    .use(pagebreaks);

  const parsed = processor.parse(file);
  return processor.run(parsed, file);
}
