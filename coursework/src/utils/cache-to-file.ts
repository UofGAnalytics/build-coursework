import fs from 'fs';
import path from 'path';

import hashSum from 'hash-sum';

import { getCacheDir } from './utils';

type Options = {
  dirPath: string | null;
  prefix: string;
  key: string;
  execFn: (code: string) => Promise<string>;
};

export async function cacheToFile({
  dirPath,
  prefix,
  key,
  execFn,
}: Options) {
  if (dirPath === null) {
    return execFn(key);
  }

  const cacheDir = getCacheDir(dirPath);
  const filePath = `${prefix}-${hashSum(key)}.txt`;
  const cachedFilePath = path.join(cacheDir, filePath);

  if (fs.existsSync(cachedFilePath)) {
    return fs.readFileSync(cachedFilePath, 'utf-8');
  }

  const out = await execFn(key);
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(cachedFilePath, out);
  return out;
}
