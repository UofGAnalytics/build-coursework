import os from 'os';
import path from 'path';

// @ts-expect-error
import toVFile from 'to-vfile';
import { Parent } from 'unist';
import { VFile } from 'vfile';

import { getUnitTitles } from '../course';
import { Options } from '../types';
import { writeFile } from '../utils/utils';
import { createHasFailingMessage } from './has-message';
import { buildUnit } from '..';

type Built = {
  mdast: Parent;
  hast: Parent;
  html: string;
};

export async function testProcessor(md: string, options: Options = {}) {
  const tempDir = os.tmpdir();
  const fileName = Math.random().toString(36).substr(2, 5);
  const filePath = path.join(tempDir, fileName + '.Rmd');

  await writeFile(filePath, unindentString(md));

  const file = (await toVFile.read(filePath, 'utf-8')) as VFile;

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
    cacheDir: tempDir,
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

  const hasFailingMessage = createHasFailingMessage(ctx, file);

  const { mdast, html, hast } = await (async (): Promise<Built> => {
    const built = await buildUnit(ctx, 0);
    if (built === null) {
      return {
        mdast: { type: 'blank', children: [] },
        html: '',
        hast: { type: 'blank', children: [] },
      };
    }
    return built;
  })();

  return { hasFailingMessage, file, html, mdast, hast };
}

export function createHtml(str: string) {
  return unindentString(str);
}

export function unindentString(str: string) {
  const arr = str.split('\n');
  const indentIdx = arr.reduce((acc, line) => {
    const idx = line.search(/[^\s]/);
    return idx > -1 && idx < acc ? idx : acc;
  }, 100);
  return arr.map((s) => s.slice(indentIdx)).join('\n');
}
