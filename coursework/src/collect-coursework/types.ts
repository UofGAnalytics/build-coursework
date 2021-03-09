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
};

export type Course = {
  title: string;
  units: Unit[];
};

export type FileRef = {
  src: string;
};
