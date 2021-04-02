import { VFile } from 'vfile';

export type CourseYaml = {
  title: string;
  units: FileRef[];
};

export type UnitYaml = {
  name: string;
  title: string;
  content: FileRef[];
};

export type Unit = UnitYaml & {
  markdown: VFile[];
  titles: UnitTitles;
};

export type Course = {
  title: string;
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
};

export type UnitTitlesInput = {
  courseTitle: string;
  unitName: string;
  unitTitle: string;
};
