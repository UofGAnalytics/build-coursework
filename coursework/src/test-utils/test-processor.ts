// @ts-expect-error
import format from 'rehype-format';
import stringify from 'rehype-stringify';
import remark2rehype from 'remark-rehype';
// @ts-expect-error
import toVFile from 'to-vfile';
import unified from 'unified';
import { VFile } from 'vfile';

import {
  customCombinedTransforms,
  customTransforms,
  linter,
  markdownParser,
} from '../processors';

export async function testProcessor(md: string) {
  const contents = unindentString(md);

  const file = toVFile({ contents }) as VFile;
  const mdast = await markdownParser(file);
  await linter(mdast, file);
  await customTransforms(mdast, file);
  await customCombinedTransforms(mdast, null);

  const processor = unified()
    .use(remark2rehype)
    .use(format)
    .use(stringify);

  const transformed = await processor.run(mdast, file);
  const html = processor.stringify(transformed, file);
  return { file, html };
}

export function createHtml(str: string) {
  return unindentString(str);
}

function unindentString(str: string) {
  const arr = str.split('\n');
  const indentIdx = arr.reduce((acc, line) => {
    const idx = line.search(/[^\s]/);
    return idx > -1 && idx < acc ? idx : acc;
  }, 100);
  return arr.map((s) => s.slice(indentIdx)).join('\n');
}
