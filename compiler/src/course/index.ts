import path from 'path';

// @ts-expect-error
import toVFile from 'to-vfile';

import { loadCourseYaml } from './load-course';
import { loadUnitYaml } from './load-unit';
import {
  Course,
  CourseYaml,
  Unit,
  UnitTitles,
  UnitTitlesInput,
} from './types';
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
  const titles = getUnitTitles({
    courseTitle: course.title,
    unitName: yaml.name,
    unitTitle: yaml.title,
  });
  return { ...yaml, markdown, titles };
}

export function getUnitTitles({
  courseTitle,
  unitName,
  unitTitle,
}: UnitTitlesInput): UnitTitles {
  return {
    courseTitle,
    unitTitle: `${unitName}: ${unitTitle}`,
    unitName,
    docTitle: `${unitTitle} | ${courseTitle}`,
  };
}
