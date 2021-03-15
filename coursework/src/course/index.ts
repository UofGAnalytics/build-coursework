import path from 'path';

// @ts-expect-error
import toVFile from 'to-vfile';

import { loadCourseYaml } from './load-course';
import { loadUnitYaml } from './load-unit';
import { Course, Unit, UnitTitles } from './types';
import { FileRef } from './types';

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

export function getUnitTitles(course: Course, unit: Unit): UnitTitles {
  const courseTitle = `${course.title}: ${unit.name}`;
  const unitTitle = unit.title;
  const unitName = unit.name;
  const docTitle = `${unitTitle} | ${courseTitle}`;
  return { courseTitle, unitTitle, unitName, docTitle };
}
