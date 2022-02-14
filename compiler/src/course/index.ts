import path from 'path';

import kebabCase from 'lodash/kebabCase.js';
import { toVFile } from 'to-vfile';

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
  const coursePath = path.join(process.cwd(), dirPath);
  const units = await Promise.all(
    course.units.map((unit) => collectUnit(unit, course, dirPath))
  );
  return { ...course, coursePath, units };
}

async function collectUnit(
  unit: FileRef,
  course: CourseYaml,
  dirPath: string
): Promise<Unit> {
  const { content, ...yaml } = await loadUnitYaml(dirPath, unit.src);
  const unitPath = path.join(process.cwd(), dirPath, unit.src);
  const files = await Promise.all(
    content.map((c) => {
      const filePath = path.join(dirPath, unit.src, '..', c.src);
      return toVFile.read(filePath, 'utf-8');
    })
  );
  const titles = getUnitTitles({
    courseTitle: course.title,
    unitName: yaml.name,
    unitTitle: yaml.title,
  });
  return { ...yaml, unitPath, parts: content, files, titles };
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
    fileName: kebabCase(unitName),
  };
}
