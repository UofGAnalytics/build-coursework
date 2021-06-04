import chalk from 'chalk';

import { collectCoursework } from './course';
import {
  customCombinedTransforms,
  customTransforms,
  htmlCompiler,
  linter,
  markdownParser,
} from './processors';
import { Context, Options } from './types';
import { printReport, reportHasFatalErrors } from './utils/report';
import {
  combineMdastTrees,
  getBuildDir,
  getCacheDir,
  mkdir,
} from './utils/utils';
import { writeHtml } from './utils/write-files';

export async function rMarkdown(dirPath: string, options: Options = {}) {
  const ctx: Context = {
    course: await collectCoursework(dirPath),
    dirPath,
    buildDir: getBuildDir(dirPath),
    cacheDir: getCacheDir(dirPath),
    options,
  };

  if (ctx.buildDir) {
    await mkdir(ctx.buildDir);
  }

  if (ctx.options.week) {
    await createUnit(ctx, ctx.options.week - 1);
  } else {
    for (let idx = 0; idx < ctx.course.units.length; idx++) {
      await createUnit(ctx, idx);
    }
  }
}

async function createUnit(ctx: Context, unitIdx: number) {
  const unit = ctx.course.units[unitIdx];
  try {
    const { html } = await buildUnit(ctx, unitIdx);
    if (ctx.buildDir) {
      await writeHtml(unit.titles.unitName, html, ctx.dirPath);
      // await writePdf(titles.unitName, pdfHtml, dirPath);
    }
  } catch (err) {
    console.error(chalk.red(err.message));
    return;
  }
}

export async function buildUnit(ctx: Context, unitIdx: number) {
  const { files } = ctx.course.units[unitIdx];

  const mdasts = await Promise.all(
    files.map((file) => markdownParser(file, ctx))
  );

  // transforms in parallel with reports back to original files
  await Promise.all(
    mdasts.map((mdast, idx) => customTransforms(mdast, ctx, files[idx]))
  );

  // linter in parallel
  await Promise.all(
    mdasts.map((mdast, idx) => linter(mdast, ctx, files[idx]))
  );

  if (!ctx.options.noReport) {
    printReport(files, ctx);
  }
  if (reportHasFatalErrors(files, ctx)) {
    throw new Error('Validation failed');
  }

  // combine mdast trees
  const mdast = combineMdastTrees(mdasts);

  // transforms on the combined tree
  await customCombinedTransforms(mdast, ctx);

  const { hast, html } = await htmlCompiler(mdast, ctx, unitIdx);

  return { mdast, hast, html };
}
