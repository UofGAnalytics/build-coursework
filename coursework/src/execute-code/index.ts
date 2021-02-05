import fs from 'fs';
import path from 'path';
import hashSum from 'hash-sum';
import { getCacheDir } from '../util';

export function executeCode(
  dirPath: string,
  code: string,
  execFn: (code: string) => string
) {
  const cacheDir = getCacheDir(dirPath);
  const filePath = `${hashSum(code)}.txt`;
  const cachedFilePath = path.join(cacheDir, filePath);

  if (fs.existsSync(cachedFilePath)) {
    return fs.readFileSync(cachedFilePath, 'utf-8');
  }

  const out = execFn(code);
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(cachedFilePath, out);

  return out;
}

function readCache(code: string) {
  return null;
}

function writeCache(out: string) {
  return null;
}
