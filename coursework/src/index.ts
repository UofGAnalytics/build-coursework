import { kebabCase } from 'lodash';
import pdf from 'html-pdf';

import { collectCoursework } from './collect-coursework';
import { Course, Unit } from './collect-coursework/types';
import { compileHtml } from './compile-html';
import { latex } from './latex';
import { codeBlocks } from './code-blocks';
import { linter } from './linter';
import { parseMarkdown } from './parse-markdown';
import { getBuildDir, mkdir, writeFile } from './util';

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
  const files = unit.markdown;

  const hasts = await Promise.all(
    files.map((file) => parseMarkdown(file, dirPath))
  );

  await Promise.all(hasts.map((hast, idx) => latex(hast, files[idx])));

  await Promise.all(
    hasts.map((hast, idx) => codeBlocks(hast, files[idx], dirPath))
  );

  // TODO: find a way to lint R code and move linter up
  await linter(hasts, files);

  const html = await compileHtml(hasts, {
    courseTitle: `${course.title}: ${unit.name}`,
    unitTitle: unit.title,
  });

  const filePath = getFilePath(dirPath, unit.name);
  await writeFile(`${filePath}.html`, html);
  console.log('html file written to:', `${filePath}.html`);

  // await writePdf(`${filePath}.pdf`, html);
  // console.log('pdf file written to:', `${filePath}.pdf`);
}

function getFilePath(dirPath: string, unitName: string) {
  const buildDir = getBuildDir(dirPath);
  const fileName = kebabCase(unitName);
  return `${buildDir}/${fileName}`;
}

// async function writePdf(filePath: string, html: string) {
//   return new Promise<void>((resolve, reject) => {
//     console.log(html);
//     pdf.create(html).toFile(filePath, (err, res) => {
//       // console.log('err:', err)
//       // console.log('res:', res)
//       if (err) {
//         reject(err);
//       }
//       resolve();
//     });
//   });
// }
