import chalk from 'chalk';

import { collectCoursework, getUnitTitles } from './course';
import { Course, Unit } from './course/types';
import {
  customCombinedTransforms,
  customTransforms,
  htmlCompiler,
  linter,
  markdownParser,
} from './processors';
import { printReport, reportHasFatalErrors } from './utils/report';
import { combineMdastTrees, getBuildDir, mkdir } from './utils/utils';
import { writeHtml } from './utils/write-files';

if (process.env.NODE_ENV === 'development') {
  buildCourse('../fixture');
}

export async function buildCourse(dirPath: string) {
  const course = await collectCoursework(dirPath);

  const buildDir = getBuildDir(dirPath);
  await mkdir(buildDir);

  for (const unit of course.units) {
    await buildUnit(dirPath, course, unit);
  }
}

export async function buildUnit(
  dirPath: string,
  course: Course,
  unit: Unit
) {
  try {
    const files = unit.markdown;

    // parse markdown
    const mdasts = await Promise.all(files.map(markdownParser));

    // transforms with reports back to original files
    await Promise.all(
      mdasts.map((mdast, idx) => customTransforms(mdast, files[idx]))
    );

    // linter
    await Promise.all(
      mdasts.map((mdast, idx) => linter(mdast, files[idx]))
    );
    printReport(files);
    if (reportHasFatalErrors(files)) {
      return;
    }

    // combine mdast trees
    const combined = combineMdastTrees(mdasts);

    // transforms on combined tree
    await customCombinedTransforms(combined, dirPath);

    // compile html
    const titles = getUnitTitles(course, unit);
    const html = await htmlCompiler(combined, dirPath, titles);
    await writeHtml(titles.unitName, html, dirPath);

    // const pdfHtml = await pdfHtmlCompiler(combined, titles, dirPath);
    // await writePdf(titles.unitName, pdfHtml, dirPath);
  } catch (err) {
    console.error(chalk.red(err.message));
  }
}
