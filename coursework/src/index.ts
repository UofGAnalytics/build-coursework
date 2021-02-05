import { kebabCase } from 'lodash';
import { Course, courseworkCompiler, Unit } from './coursework-compiler';
import { renderHtml } from './markdown-parser';
import { compileTemplate } from './template-compiler';
import { getBuildDir, mkdir, writeFile } from './util';

buildCoursework('../example');

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
  const buildDir = getBuildDir(dirPath);
  const fileName = kebabCase(unit.name);

  const html = unit.markdown
    .map((markdown) => renderHtml(dirPath, markdown))
    .join('\n');
  const template = await compileTemplate(course, unit, html);

  await writeFile(`${buildDir}/${fileName}.html`, template);
}
