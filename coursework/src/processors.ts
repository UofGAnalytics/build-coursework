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
import directive from 'remark-directive';
import gfm from 'remark-gfm';
import math from 'remark-math';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
// @ts-expect-error
import remark2retext from 'remark-retext';
// @ts-expect-error
import english from 'retext-english';
// @ts-expect-error
import spell from 'retext-spell';
import unified from 'unified';
import { Node } from 'unist';
import { VFile } from 'vfile';

import { codeMod } from './code-mod';
import { UnitTitles } from './course/types';
import { getTemplateCss, getTemplateJs } from './env';
import type { Options } from './index';
import { assertTaskAnswerStructure } from './linters/assert-task-answer';
import { lintLatex } from './linters/lint-latex';
import { embedAssets } from './transforms-hast/embed-assets';
import { htmlWrapper } from './transforms-hast/html-wrapper';
import { accessibleTex } from './transforms-mdast/accessible-tex';
import { boxouts } from './transforms-mdast/boxouts';
import { codeBlocks } from './transforms-mdast/code-blocks';
import { embedAssetUrl } from './transforms-mdast/embed-asset-urls';
import { moveAnswersToEnd } from './transforms-mdast/move-answers-to-end';
import { youtubeVideos } from './transforms-mdast/youtube-videos';

// import { inspect } from './utils/utils';

export async function markdownParser(file: VFile) {
  file.contents = codeMod(file.contents as string);
  const processor = unified()
    .use(markdown)
    .use(directive)
    .use(math)
    .use(gfm);
  const parsed = processor.parse(file);
  return processor.run(parsed, file);
}

export async function customTransforms(mdast: Node, file: VFile) {
  const processor = unified().use(embedAssetUrl).use(youtubeVideos);
  return processor.run(mdast, file);
}

export async function linter(mdast: Node, file: VFile) {
  const retextProcessor = unified().use(english).use(spell, dictionary);
  const processor = unified()
    .use(assertTaskAnswerStructure)
    .use(lintLatex)
    .use(lintAltText)
    .use(lintLinkText)
    .use(remark2retext, retextProcessor);

  return processor.run(mdast, file);
}

export async function customCombinedTransforms(
  mdast: Node,
  dirPath: string | null
) {
  const processor = unified()
    .use(boxouts)
    .use(moveAnswersToEnd)
    // .use(inspect)
    .use(accessibleTex)
    .use(codeBlocks, dirPath);

  return processor.run(mdast);
}

export async function htmlCompiler(
  mdast: Node,
  dirPath: string | null,
  titles: UnitTitles,
  options: Options
) {
  const processor = unified()
    .use(remark2rehype)
    .use(embedAssets, dirPath) // TODO: try to get this inside custom transforms
    .use(htmlWrapper, titles)
    .use(format)
    .use(stringify);

  if (!options.noDoc) {
    processor.use(doc, {
      title: titles.docTitle,
      style: `\n${await getTemplateCss()}\n`,
      script: `\n${await getTemplateJs()}\n`,
    });
  }

  const transformed = await processor.run(mdast);
  return processor.stringify(transformed);
}

export async function pdfHtmlCompiler(
  mdast: Node,
  dirPath: string | null,
  titles: UnitTitles,
  options: Options
) {
  // TODO: pdf cover
  return htmlCompiler(mdast, dirPath, titles, options);
}