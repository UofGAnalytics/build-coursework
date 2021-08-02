import { collectCoursework } from './course';
import { Course } from './course/types';
import { getBuildDir, getCacheDir } from './utils/utils';

export type Options = {
  noDoc?: boolean;
  noHtml?: boolean;
  noPdf?: boolean;
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
  buildDir: string;
  cacheDir: string;
  course: Course;
  options: Options;
  texStore?: string[];
};

export async function createContext(
  dirPath: string,
  options: Options = {}
): Promise<Context> {
  return {
    course: await collectCoursework(dirPath),
    dirPath,
    buildDir: getBuildDir(dirPath),
    cacheDir: getCacheDir(dirPath),
    options,
  };
}
