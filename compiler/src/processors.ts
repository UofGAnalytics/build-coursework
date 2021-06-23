import path from 'path';

// @ts-expect-error
import lintAltText from '@double-great/remark-lint-alt-text';
// @ts-expect-error
import lintLinkText from '@mapbox/remark-lint-link-text';
// @ts-expect-error
import dictionary from 'dictionary-en-gb';
import doc from 'rehype-document';
// @ts-expect-error
import format from 'rehype-format';
import stringify from 'rehype-stringify';
// @ts-expect-error
import headings from 'remark-autolink-headings';
import directive from 'remark-directive';
import frontmatter from 'remark-frontmatter';
import gfm from 'remark-gfm';
import math from 'remark-math';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
// @ts-expect-error
import remark2retext from 'remark-retext';
// @ts-expect-error
import slug from 'remark-slug';
// @ts-expect-error
import english from 'retext-english';
// @ts-expect-error
import spell from 'retext-spell';
import unified from 'unified';
import { Node } from 'unist';
import { VFile } from 'vfile';

import { assertAssetExists } from './linters/assert-asset-exists';
import { assertTaskAnswerStructure } from './linters/assert-task-answer';
import { assertVideoAttributes } from './linters/assert-video-attributes';
import { assertWeblinkTarget } from './linters/assert-weblink-target';
import { lintLatex } from './linters/lint-latex';
import { embedAssets } from './transforms-hast/embed-assets';
import { htmlWrapper } from './transforms-hast/html-wrapper';
import { accessibleTex } from './transforms-mdast/accessible-tex';
import { boxouts } from './transforms-mdast/boxouts';
import { codeBlocks } from './transforms-mdast/code-blocks';
import { embedAssetUrl } from './transforms-mdast/embed-asset-url';
import { images } from './transforms-mdast/images';
import { responsiveTables } from './transforms-mdast/responsive-tables';
// import { moveAnswersToEnd } from './transforms-mdast/move-answers-to-end';
import { youtubeVideos } from './transforms-mdast/youtube-videos';
import { Context } from './types';
import { createSvg } from './utils/icons';
import { readFile } from './utils/utils';

// import { inspect } from './utils/utils';

export async function markdownParser(file: VFile, ctx: Context) {
  const processor = unified()
    .use(markdown)
    .use(directive)
    .use(math)
    .use(gfm)
    .use(frontmatter)
    .use(embedAssetUrl);
  const parsed = processor.parse(file);
  return processor.run(parsed, file);
}

export async function linter(mdast: Node, ctx: Context, file: VFile) {
  const processor = unified()
    .use(assertAssetExists)
    .use(assertVideoAttributes)
    .use(assertTaskAnswerStructure)
    .use(assertWeblinkTarget)
    .use(lintLatex)
    .use(lintAltText)
    .use(lintLinkText);

  if (ctx.options.spelling) {
    const retextProcessor = unified()
      .use(english)
      .use(spell, { dictionary, max: 1 });

    processor.use(remark2retext, retextProcessor);
  }

  return processor.run(mdast, file);
}

export async function customCombinedTransforms(mdast: Node, ctx: Context) {
  const linkIcon = createSvg('link-icon');
  const processor = unified()
    .use(slug)
    .use(headings, {
      content: linkIcon,
      linkProperties: { className: 'link' },
    })
    .use(youtubeVideos)
    .use(responsiveTables)
    .use(accessibleTex, ctx)
    .use(codeBlocks, ctx)
    .use(boxouts)
    .use(images);
  // .use(moveAnswersToEnd);

  return processor.run(mdast);
}

export async function htmlCompiler(
  mdast: Node,
  ctx: Context,
  unitIdx: number
) {
  const { titles } = ctx.course.units[unitIdx];
  const processor = unified()
    .use(remark2rehype)
    .use(format)
    .use(stringify);

  if (!ctx.options.noEmbedAssets) {
    processor.use(embedAssets, ctx); // TODO: try to get this inside custom transforms
  }

  if (!ctx.options.noWrapper) {
    processor.use(htmlWrapper, titles, mdast);
  }

  if (!ctx.options.noDoc) {
    const templateCss = await readFile(
      path.join(__dirname, 'template.css')
    );
    const templateJs = await readFile(
      path.join(__dirname, 'template.js2')
    );
    processor.use(doc, {
      title: titles.docTitle,
      style: `\n${templateCss}\n`,
      script: `\n${templateJs}\n`,
    });
  }

  const hast = await processor.run(mdast);

  const html = processor.stringify(hast);

  return { hast, html };
}

export async function pdfHtmlCompiler(
  mdast: Node,
  ctx: Context,
  unitIdx: number
) {
  // TODO: pdf cover
  // const processor = unified().use(moveAnswersToEnd);
  // const transformed = await processor.run(mdast);
}
