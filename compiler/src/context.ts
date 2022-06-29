import { collectCoursework } from './course';
import { Course } from './course/types';
import { getBuildDir, getCacheDir } from './utils/utils';

export type Options = {
  noDoc?: boolean;
  noHtml?: boolean;
  noPdf?: boolean;
  noSyntaxHighlight?: boolean;
  noReport?: boolean;
  reportOnlyErrors?: boolean;
  noEmbedAssets?: boolean;
  noEmbedAssetUrl?: boolean;
  noCache?: boolean;
  noTexSvg?: boolean;
  noHexagons?: boolean;
  week?: number;
  watch?: boolean;
  shouldFail?: boolean;
  spelling?: boolean;
  force?: boolean;
  noWrite?: boolean;
  format?: boolean;
  pythonBin?: string;
  verbose?: boolean;
  envPlatform?: string;
  envProgram?: string;
  output?: 'md' | 'html';
};

export type Context = {
  dirPath: string;
  buildDir: string;
  cacheDir: string;
  course: Course;
  options: Options;
  mmlStore?: string[];
  refStore: Record<string, string>;
  figureCounter: number;
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
    refStore: {},
    figureCounter: 0,
  };
}
