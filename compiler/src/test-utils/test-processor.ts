import os from 'os';
import path from 'path';

import { Parent as HastParent } from 'hast';
import { Parent as MDastParent } from 'mdast';
// @ts-expect-error
import toVFile from 'to-vfile';
import { VFile } from 'vfile';

import { buildUnit } from '../build-unit';
import { Options } from '../context';
import { getUnitTitles } from '../course';
import { writeFile } from '../utils/utils';
import {
  createHasFailingMessage,
  createHasWarningMessage,
} from './has-message';

export async function testProcessor(md: string, options: Options = {}) {
  const { ctx, file } = await createTestContext(md, options);
  const unitFile = ctx.course.units[0];

  const unit = {
    md: '',
    mdast: {} as MDastParent,
    hast: {} as HastParent,
    html: '',
    combined: [] as VFile[],
  };
  try {
    const result = await buildUnit(unitFile, ctx);
    unit.md = result.md;
    unit.combined = [file, ...result.combined];
    if (result.html) {
      unit.mdast = result.html.mdast;
      unit.hast = result.html.hast;
      unit.html = result.html.html;
    } else {
      console.log(
        '[test processor]: no html object returned from buildUnit'
      );
    }
  } catch (err) {
    console.error(err);
  }

  const hasFailingMessage = createHasFailingMessage(ctx, unit.combined);
  const hasWarningMessage = createHasWarningMessage(ctx, unit.combined);

  return { file, hasFailingMessage, hasWarningMessage, ...unit };
}

async function createTestContext(md: string, options: Options = {}) {
  const cacheDir = os.tmpdir();
  const file = await createTestFile(md, cacheDir);

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
    cacheDir,
    buildDir: '',
    course: {
      ...course,
      units: [{ ...unit, titles }],
    },
    options: {
      noDoc: true,
      noPdf: true,
      noWrapper: true,
      noSyntaxHighlight: true,
      noReport: true,
      noEmbedAssets: true,
      force: true,
      ...options,
    },
  };

  return { ctx, file };
}

async function createTestFile(md: string, cacheDir: string) {
  const fileName = Math.random().toString(36).substr(2, 5);
  const filePath = path.join(cacheDir, fileName + '.Rmd');
  await writeFile(filePath, unindentString(md));
  const file = await toVFile.read(filePath, 'utf-8');
  return file as VFile;
}

export function unindentString(str: string) {
  const arr = str.split('\n');
  const indentIdx = arr.reduce((acc, line) => {
    const idx = line.search(/[^\s]/);
    return idx > -1 && idx < acc ? idx : acc;
  }, 100);
  return arr.map((s) => s.slice(indentIdx)).join('\n');
}

export function unindentStringAndTrim(str: string) {
  return unindentString(str).trim();
}

export function ignoreWhitespace(str: string) {
  return str.replace(/\s+/g, '');
}
