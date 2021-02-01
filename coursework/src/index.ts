import { kebabCase } from 'lodash';
import { courseworkCompiler } from './coursework-compiler';
import { compileTemplate } from './template-compiler';
import { log, writeFile, mkdir } from './util';

export async function buildCoursework(dirPath: string) {
  const coursework = await courseworkCompiler(dirPath);
  const template = await compileTemplate(coursework);

  const name = kebabCase(coursework.units[0].name);
  await mkdir(`${dirPath}/build`);
  await writeFile(`${dirPath}/build/${name}.html`, template);
  log(template);
}
