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

export async function buildCourse(dirPath: string, options: Options = {}) {
  const course = await collectCoursework(dirPath);

  const ctx: Context = {
    buildDir: getBuildDir(dirPath),
    cacheDir: getCacheDir(dirPath),
    course,
    options,
  };

  if (ctx.buildDir) {
    await mkdir(ctx.buildDir);
  }

  for (let idx = 0; idx < course.units.length; idx++) {
    const unit = course.units[idx];

    try {
      const mdast = await buildUnit(ctx, idx);
      if (mdast !== null && ctx.buildDir) {
        const html = await htmlCompiler(mdast, ctx, idx);
        await writeHtml(unit.titles.unitName, html, dirPath);
        // await writePdf(titles.unitName, pdfHtml, dirPath);
      }
    } catch (err) {
      console.error(chalk.red(err.message));
      return;
    }
  }
}

export async function buildUnit(ctx: Context, unitIdx: number) {
  const files = ctx.course.units[unitIdx].markdown;
  const mdasts = await Promise.all(files.map(markdownParser));

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
    return null;
  }

  // combine mdast trees
  const combined = combineMdastTrees(mdasts);

  // transforms on the combined tree
  await customCombinedTransforms(combined, ctx);

  return combined;
}
