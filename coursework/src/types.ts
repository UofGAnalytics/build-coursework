import { Course } from './course/types';

export type Options = {
  noDoc?: boolean;
  noSyntaxHighlight?: boolean;
  noReport?: boolean;
  noEmbedAssets?: boolean;
  week?: number;
  watch?: boolean;
};

export type Context = {
  buildDir: string | null;
  cacheDir: string | null;
  course: Course;
  options: Options;
};
