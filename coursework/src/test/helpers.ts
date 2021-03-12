import unified from 'unified';
import remark2rehype from 'remark-rehype';
import stringify from 'rehype-stringify';
import { VFile } from 'vfile';

import { reportHasFatalErrors } from '../report';
import { MessageStatus } from '../message';
import {
  markdownParser,
  linter,
  customTransforms,
  customCombinedTransforms,
} from '../processors';

// @ts-expect-error
import format from 'rehype-format';
// @ts-expect-error
import toVFile from 'to-vfile';

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
  const indent = arr.reduce((acc, line) => {
    const idx = line.search(/[^\s]/);
    return idx > -1 && idx < acc ? idx : acc;
  }, 100);
  return arr.map((s) => s.slice(indent)).join('\n');
}

export function hasFailingMessage(file: VFile, reason: string) {
  const errors = file.messages.filter((o) => o.reason === reason);
  if (errors.length !== 1) {
    console.log('Message not found in these messages:');
    console.log(file.messages);
    return false;
  }
  if (errors[0].status !== MessageStatus.fail) {
    return false;
  }
  return reportHasFatalErrors([file]);
}
