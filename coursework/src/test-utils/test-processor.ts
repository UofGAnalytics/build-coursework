// @ts-expect-error
import toVFile from 'to-vfile';
import { VFile } from 'vfile';

import { getUnitTitles } from '../course';
import { htmlCompiler } from '../processors';
import { Options } from '../types';
import { buildUnit } from '..';

export async function testProcessor(md: string, options: Options = {}) {
  const contents = createHtml(md);

  const file = toVFile({
    path: 'test',
    contents,
  }) as VFile;

  const course = {
    title: 'Test Course',
    units: [{ src: 'test' }],
  };

  const unit = {
    name: 'Week Test',
    title: 'Test Unit',
    content: [{ src: contents }],
    markdown: [file],
  };

  const titles = getUnitTitles(course, unit);

  const ctx = {
    cacheDir: null,
    buildDir: null,
    course: {
      ...course,
      units: [{ ...unit, titles }],
    },
    options: {
      noDoc: true,
      noSyntaxHighlight: true,
      noReport: true,
      noEmbedAssets: true,
      ...options,
    },
  };

  const mdast = await buildUnit(ctx, 0);
  let html = '';
  if (mdast !== null) {
    html = await htmlCompiler(mdast, ctx, 0);
  }
  return { file, html, mdast };
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
