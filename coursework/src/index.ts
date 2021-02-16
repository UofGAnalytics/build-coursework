import { kebabCase } from 'lodash';
import { convertToHtml } from './markdown-parser';
import { Course, courseworkCompiler, Unit } from './coursework-compiler';
import { getBuildDir, mkdir, writeFile } from './util';

if (process.env.NODE_ENV === 'development') {
  buildCoursework('../fixture');
}

export async function buildCoursework(dirPath: string) {
  const course = await courseworkCompiler(dirPath);
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
  const md = unit.markdown.join('\n');

  const html = await convertToHtml(md, {
    courseTitle: `${course.title}: ${unit.name}`,
    unitTitle: unit.title,
    dirPath,
  });

  const buildDir = getBuildDir(dirPath);
  const fileName = kebabCase(unit.name);
  const targetPath = `${buildDir}/${fileName}.html`;
  await writeFile(targetPath, html.contents as string);
  console.log('file written to:', targetPath);
}
