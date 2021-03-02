import path from 'path';
import { loadCourseYaml } from './load-course';
import { loadUnitYaml } from './load-unit';
import { FileRef } from './types';
import { Course } from '../collect-coursework/types';

// @ts-expect-error
import toVFile from 'to-vfile';

export async function collectCoursework(dirPath: string): Promise<Course> {
  const course = await loadCourseYaml(dirPath);
  const units = await Promise.all(
    course.units.map((unit) => collectUnitContents(dirPath, unit))
  );
  return { ...course, units };
}

async function collectUnitContents(dirPath: string, unit: FileRef) {
  const yaml = await loadUnitYaml(dirPath, unit.src);
  const markdown = await Promise.all(
    yaml.content.map((c) =>
      toVFile.read(path.join(dirPath, unit.src, '..', c.src), 'utf-8')
    )
  );
  return { ...yaml, markdown };
}
