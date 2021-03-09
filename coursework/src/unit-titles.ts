import { Course, Unit } from './collect-coursework/types';

export type UnitTitles = {
  courseTitle: string;
  unitTitle: string;
  unitName: string;
  docTitle: string;
};

export function getUnitTitles(course: Course, unit: Unit): UnitTitles {
  const courseTitle = `${course.title}: ${unit.name}`;
  const unitTitle = unit.title;
  const unitName = unit.name;
  const docTitle = `${unitTitle} | ${courseTitle}`;
  return { courseTitle, unitTitle, unitName, docTitle };
}
