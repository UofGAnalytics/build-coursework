import fs from 'fs';
import path from 'path';
import hashSum from 'hash-sum';
import { getCacheDir } from './util';

type Options = {
  dirPath: string;
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
