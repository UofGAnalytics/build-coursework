import { VFile } from 'vfile';
import { Node } from 'unist';
import unified from 'unified';
import markdown from 'remark-parse';
import directive from 'remark-directive';
import math from 'remark-math';
import remark2rehype from 'remark-rehype';
import doc from 'rehype-document';
import stringify from 'rehype-stringify';

import { embedAssetUrl, embedAssets } from './transforms/embed-assets';
import { youtubeVideos } from './transforms/youtube-videos';
import {
  assertTaskAnswerStructure,
  moveAnswersToEnd,
} from './transforms/task-answer';
import { boxouts } from './transforms/boxouts';
import { customCodeOutput } from './code-blocks/custom-code-output';
import { lintLatex } from './transforms/lint-latex';
import { incrementTitles } from './transforms/increment-titles';
import { accessibleLatex } from './latex';
import { UnitTitles } from './unit-titles';
import { htmlWrapper } from './transforms/html-wrapper';
import { getTemplateCss, getTemplateJs } from './env';
// import { inspect } from './util';

// @ts-expect-error
import english from 'retext-english';
// @ts-expect-error
import spell from 'retext-spell';
// @ts-expect-error
import dictionary from 'dictionary-en-gb';
// @ts-expect-error
import lintAltText from '@double-great/remark-lint-alt-text';
// @ts-expect-error
import lintLinkText from '@mapbox/remark-lint-link-text';
// @ts-expect-error
import remark2retext from 'remark-retext';
// @ts-expect-error
import format from 'rehype-format';

export async function markdownParser(file: VFile) {
  const processor = unified().use(markdown).use(directive).use(math);
  const parsed = processor.parse(file);
  return processor.run(parsed, file);
}

export async function customTransforms(mdast: Node, file: VFile) {
  const processor = unified()
    .use(embedAssetUrl)
    .use(boxouts)
    .use(youtubeVideos);

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
    .use(incrementTitles)
    .use(moveAnswersToEnd)
    // .use(inspect)
    .use(accessibleLatex)
    .use(customCodeOutput, dirPath);

  return processor.run(mdast);
}

export async function htmlCompiler(
  mdast: Node,
  dirPath: string | null,
  titles: UnitTitles
) {
  const style = await getTemplateCss();
  const script = await getTemplateJs();
  const processor = unified()
    .use(remark2rehype)
    .use(embedAssets, dirPath) // TODO: try to get this inside custom transforms
    .use(htmlWrapper, titles)
    .use(doc, {
      title: titles.docTitle,
      style: `\n${style}\n`,
      script: `\n${script}\n`,
    })
    .use(format)
    .use(stringify);

  const transformed = await processor.run(mdast);
  return processor.stringify(transformed);
}

export async function pdfHtmlCompiler(
  mdast: Node,
  dirPath: string | null,
  titles: UnitTitles
) {
  // TODO: pdf cover
  return htmlCompiler(mdast, dirPath, titles);
}
