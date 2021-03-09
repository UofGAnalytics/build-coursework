import { Node } from 'hast';
import unified from 'unified';
import remark2rehype from 'remark-rehype';
import doc from 'rehype-document';
import stringify from 'rehype-stringify';
import { htmlWrapper } from './transforms/html-wrapper';
import { getTemplateCss, getTemplateJs } from './env';
import { UnitTitles } from './unit-titles';
import { boxouts } from './transforms/boxouts';
import { accessibleLatex } from './latex';
import { incrementTitles } from './transforms/increment-titles';
import { moveAnswersToEnd } from './transforms/task-answer';
import { embedAssets } from './transforms/embed-assets';
// import { inspect } from './util';

// @ts-expect-error
import format from 'rehype-format';
// @ts-expect-error
import embedImages from 'remark-embed-images';

export async function compileHtml(
  mdast: Node,
  titles: UnitTitles,
  dirPath: string
) {
  const processor = unified()
    .use(incrementTitles)
    .use(boxouts)
    .use(moveAnswersToEnd)
    .use(accessibleLatex)
    .use(remark2rehype)
    .use(htmlWrapper, titles)
    .use(embedAssets, dirPath)
    // .use(inspect)
    .use(doc, await getDocumentOptions(titles.docTitle))
    .use(format)
    .use(stringify);

  const transformed = await processor.run(mdast);
  return processor.stringify(transformed);
}

async function getDocumentOptions(title: string): Promise<doc.Options> {
  const style = await getTemplateCss();
  const script = await getTemplateJs();
  return {
    title,
    style: `\n${style}\n`,
    script: `\n${script}\n`,
  };
}

export async function compilePdfHtml(
  mdast: Node,
  titles: UnitTitles,
  dirPath: string
) {
  // TODO
  return compileHtml(mdast, titles, dirPath);
}
