import os from 'os';
import path from 'path';

import { Parent as HastParent } from 'hast';
import { Parent as MDastParent } from 'mdast';
import { read as vFileRead } from 'to-vfile';
import { VFile } from 'vfile';

import { buildUnit } from '../build-unit';
import { Context, Options } from '../context';
import { getUnitTitles } from '../course';
import { writeFile } from '../utils/utils';
import {
  createHasFailingMessage,
  createHasWarningMessage,
  createMessageReasons,
} from './has-message';

export async function testProcessor(md: string, options: Options = {}) {
  const { ctx, file } = await createTestContext(md, options);
  const unitFile = ctx.course.units[0];

  const unit = {
    md: '',
    files: [] as VFile[],
    mdast: {} as MDastParent,
    hast: {} as HastParent,
    html: '',
  };
  try {
    const result = await buildUnit(unitFile, ctx);
    unit.md = result.md || '';
    unit.files = result.files;
    if (result.html) {
      unit.mdast = result.html.mdast;
      unit.hast = result.html.hast;
      unit.html = result.html.html;
    } else {
      console.log(
        '[test processor]: no html object returned from buildUnit',
      );
    }
  } catch (err) {
    console.error(err);
  }

  const hasFailingMessage = createHasFailingMessage(ctx, unit.files);
  const hasWarningMessage = createHasWarningMessage(ctx, unit.files);

  const messages = createMessageReasons(unit.files);

  return { file, hasFailingMessage, hasWarningMessage, messages, ...unit };
}

async function createTestContext(md: string, options: Options = {}) {
  const cacheDir = os.tmpdir();
  const file = await createTestFile(md, cacheDir);
  const unitPath = 'test';

  const course = {
    title: 'Test Course',
    catalog: 'STATS5078',
    authors: 'David McArthur',
    academic_year: '2021-22',
    coursePath: cacheDir,
    units: [{ src: unitPath }],
  };

  const unit = {
    name: 'Week Test',
    title: 'Test Unit',
    unitPath: path.join(cacheDir, unitPath),
    parts: [{ src: '' }],
    files: [file],
  };

  const titles = getUnitTitles({
    courseTitle: course.title,
    unitName: unit.name,
    unitTitle: unit.title,
  });

  const ctx: Context = {
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
      noSyntaxHighlight: true,
      noReport: true,
      noEmbedAssets: true,
      noEmbedAssetUrl: true,
      force: true,
      format: true,
      ...options,
    },
    refStore: {},
    figureCounter: 0,
  };

  return { ctx, file };
}

async function createTestFile(md: string, cacheDir: string) {
  const fileName = Math.random().toString(36).substr(2, 5);
  const filePath = path.join(cacheDir, fileName + '.Rmd');
  await writeFile(filePath, unindentString(md));
  return vFileRead(filePath, 'utf-8');
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

export function normalizeLineEndings(str: string, normalized = '\n') {
  return str.replace(/\r?\n/g, normalized);
}
