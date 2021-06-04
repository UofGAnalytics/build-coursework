import { Course } from './course/types';

export type Options = {
  noDoc?: boolean;
  noWrapper?: boolean;
  noSyntaxHighlight?: boolean;
  noReport?: boolean;
  noEmbedAssets?: boolean;
  noCache?: boolean;
  week?: number;
  watch?: boolean;
};

export type Context = {
  dirPath: string;
  buildDir: string | null;
  cacheDir: string;
  course: Course;
  options: Options;
};
