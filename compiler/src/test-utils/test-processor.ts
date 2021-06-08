import os from 'os';

// @ts-expect-error
import toVFile from 'to-vfile';
import { VFile } from 'vfile';

import { getUnitTitles } from '../course';
import { Options } from '../types';
import { createHasFailingMessage } from './has-message';
import { buildUnit } from '..';

export async function testProcessor(md: string, options: Options = {}) {
  const file = toVFile({
    path: 'fake-path/fake.md',
    contents: createHtml(md),
  }) as VFile;

  const course = {
    title: 'Test Course',
    units: [{ src: 'test' }],
  };

  const unit = {
    name: 'Week Test',
    title: 'Test Unit',
    parts: [{ src: '' }],
    files: [file],
  };

  const titles = getUnitTitles({
    courseTitle: course.title,
    unitName: unit.name,
    unitTitle: unit.title,
  });

  const ctx = {
    dirPath: '',
    cacheDir: os.tmpdir(),
    buildDir: null,
    course: {
      ...course,
      units: [{ ...unit, titles }],
    },
    options: {
      noDoc: true,
      noWrapper: true,
      noSyntaxHighlight: true,
      noReport: true,
      noEmbedAssets: true,
      ...options,
    },
  };

  const hasFailingMessage = createHasFailingMessage(ctx);

  const { mdast, html, hast } = await buildUnit(ctx, 0);

  return { hasFailingMessage, file, html, mdast, hast };
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
