import { courseworkCompiler } from './coursework-compiler';
import { compileTemplate } from './template-compiler';
import { writeFile, mkdir } from './util';

export async function buildCoursework(dirPath: string) {
  const course = await courseworkCompiler(dirPath);

  for (let idx = 0; idx < course.units.length; ++idx) {
    const template = await compileTemplate(course, idx);
    await mkdir(`${dirPath}/build`);
    await writeFile(`${dirPath}/build/unit-${idx + 1}.html`, template);
  }
}
