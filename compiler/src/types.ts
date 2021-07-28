import { Course } from './course/types';

export type Options = {
  noDoc?: boolean;
  noWrapper?: boolean;
  noSyntaxHighlight?: boolean;
  noReport?: boolean;
  reportOnlyErrors?: boolean;
  noEmbedAssets?: boolean;
  noCache?: boolean;
  week?: number;
  watch?: boolean;
  shouldFail?: boolean;
  spelling?: boolean;
};

export type Context = {
  dirPath: string;
  buildDir: string | null;
  cacheDir: string;
  course: Course;
  options: Options;
  texStore?: string[];
};
