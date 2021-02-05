import { courseworkCompiler } from './coursework-compiler';
import { compileTemplate } from './template-compiler';
import { writeFile, mkdir, rmdir, getBuildDir, getCacheDir } from './util';

export async function buildCoursework(dirPath: string) {
  const course = await courseworkCompiler(dirPath);
  const buildDir = getBuildDir(dirPath);
  const cacheDir = getCacheDir(dirPath);
  await mkdir(cacheDir);

  for (let idx = 0; idx < course.units.length; ++idx) {
    const template = await compileTemplate(course, idx);
    await writeFile(`${buildDir}/unit-${idx + 1}.html`, template);
  }

  await rmdir(cacheDir);
}

buildCoursework('../example');
