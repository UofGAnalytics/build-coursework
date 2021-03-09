import chalk from 'chalk';
import { collectCoursework } from './collect-coursework';
import { Course, Unit } from './collect-coursework/types';
// import { codeBlocks } from './code-blocks';
import { parseMarkdown } from './parse-markdown';
import { combineMdastTrees, getBuildDir, mkdir } from './util';
import { getUnitTitles } from './unit-titles';
import { writeHtml } from './write-files';
import { compileHtml } from './compile-html';
// import { report } from './report';

if (process.env.NODE_ENV === 'development') {
  buildCourse('../fixture');
}

export async function buildCourse(dirPath: string) {
  try {
    const course = await collectCoursework(dirPath);

    const buildDir = getBuildDir(dirPath);
    await mkdir(buildDir);

    for (const unit of course.units) {
      await buildUnit(dirPath, course, unit);
    }
  } catch (err) {
    console.error(chalk.red(err.message));
  }
}

export async function buildUnit(
  dirPath: string,
  course: Course,
  unit: Unit
) {
  const files = unit.markdown;

  const mdasts = await Promise.all(files.map(parseMarkdown));
  // report(files);

  // codeBlocks executes R and lints via RScript stderr inline
  // await codeBlocks(mdasts, files, dirPath);

  const combined = combineMdastTrees(mdasts);
  const titles = getUnitTitles(course, unit);

  const html = await compileHtml(combined, titles, dirPath);
  await writeHtml(titles.unitName, html, dirPath);

  // const pdfHtml = await compilePdfHtml(combined, titles, dirPath);
  // await writePdf(titles.unitName, pdfHtml, dirPath);
}
