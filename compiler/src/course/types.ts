import { VFile } from 'vfile';

export type CourseYaml = {
  title: string;
  catalog?: string;
  authors: string;
  academic_year: string;
  units: FileRef[];
};

export type UnitYaml = {
  name: string;
  title: string;
  content: FileRef[];
};

export type Unit = {
  name: string;
  title: string;
  unitPath: string;
  parts: FileRef[];
  files: VFile[];
  titles: UnitTitles;
};

export type Course = {
  title: string;
  catalog?: string;
  authors: string;
  academic_year: string;
  coursePath: string;
  units: Unit[];
};

export type FileRef = {
  src: string;
};

export type UnitTitles = {
  courseTitle: string;
  unitTitle: string;
  unitName: string;
  docTitle: string;
  fileName: string;
};

export type UnitTitlesInput = {
  courseTitle: string;
  unitName: string;
  unitTitle: string;
};
