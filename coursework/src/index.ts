import { kebabCase } from 'lodash';
import { courseworkCompiler } from './coursework-compiler';
import { renderHtml } from './markdown-parser';
import { compileTemplate } from './template-compiler';
import { getBuildDir, mkdir, writeFile } from './util';

export async function buildCoursework(dirPath: string) {
  const course = await courseworkCompiler(dirPath);
  const buildDir = getBuildDir(dirPath);
  await mkdir(buildDir);

  for (const unit of course.units) {
    const html = unit.markdown
      .map((markdown) => renderHtml(dirPath, markdown))
      .join('\n');
    const template = await compileTemplate(course, unit, html);
    const fileName = kebabCase(unit.name);
    await writeFile(`${buildDir}/${fileName}.html`, template);
  }
}

buildCoursework('../example');
