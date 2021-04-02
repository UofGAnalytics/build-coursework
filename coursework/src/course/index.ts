import path from 'path';

// @ts-expect-error
import toVFile from 'to-vfile';

import { loadCourseYaml } from './load-course';
import { loadUnitYaml } from './load-unit';
import { Course, CourseYaml, Unit, UnitTitles, UnitYaml } from './types';
import { FileRef } from './types';

export async function collectCoursework(dirPath: string): Promise<Course> {
  const course = await loadCourseYaml(dirPath);
  const units = await Promise.all(
    course.units.map((unit) => collectUnitContents(unit, course, dirPath))
  );
  return { ...course, units };
}

async function collectUnitContents(
  unit: FileRef,
  course: CourseYaml,
  dirPath: string
): Promise<Unit> {
  const yaml = await loadUnitYaml(dirPath, unit.src);
  const markdown = await Promise.all(
    yaml.content.map((c) =>
      toVFile.read(path.join(dirPath, unit.src, '..', c.src), 'utf-8')
    )
  );
  const result = { ...yaml, markdown };
  const titles = getUnitTitles(course, result);
  return { ...result, titles };
}

export function getUnitTitles(
  course: CourseYaml,
  unit: UnitYaml
): UnitTitles {
  const courseTitle = course.title;
  const unitTitle = `${unit.name}: ${unit.title}`;
  const unitName = unit.name;
  const docTitle = `${unitTitle} | ${courseTitle}`;
  return { courseTitle, unitTitle, unitName, docTitle };
}
