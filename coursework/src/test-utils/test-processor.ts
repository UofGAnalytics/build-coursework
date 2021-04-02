// @ts-expect-error
import toVFile from 'to-vfile';
import { Parent } from 'unist';
import { VFile } from 'vfile';

import { getUnitTitles } from '../course';
import { Options } from '../types';
import { createHasFailingMessage } from './has-message';
import { buildUnit } from '..';

export async function testProcessor(md: string, options: Options = {}) {
  const contents = createHtml(md);

  const file = toVFile({
    path: 'fake-path/fake.md',
    contents,
  }) as VFile;

  const course = {
    title: 'Test Course',
    units: [{ src: 'test' }],
  };

  const unit = {
    name: 'Week Test',
    title: 'Test Unit',
  };

  const ctx = {
    cacheDir: null,
    buildDir: null,
    course: {
      ...course,
      units: [
        {
          ...unit,
          markdown: [file],
          content: [{ src: '' }],
          titles: getUnitTitles({
            courseTitle: course.title,
            unitName: unit.name,
            unitTitle: unit.title,
          }),
        },
      ],
    },
    options: {
      noDoc: true,
      noSyntaxHighlight: true,
      noReport: true,
      noEmbedAssets: true,
      ...options,
    },
  };
  const hasFailingMessage = createHasFailingMessage(ctx);

  try {
    const { mdast, html } = await buildUnit(ctx, 0);
    return { file, html, mdast, hasFailingMessage };
  } catch (err) {
    return { file, html: '', mdast: {} as Parent, hasFailingMessage };
  }
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
