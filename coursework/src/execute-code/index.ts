import fs from 'fs';
import path from 'path';
import hashSum from 'hash-sum';
import { getCacheDir } from '../util';

export async function executeCode(
  dirPath: string,
  code: string,
  execFn: (code: string) => Promise<string>
) {
  const cacheDir = getCacheDir(dirPath);
  const filePath = `${hashSum(code)}.txt`;
  const cachedFilePath = path.join(cacheDir, filePath);

  if (fs.existsSync(cachedFilePath)) {
    return fs.readFileSync(cachedFilePath, 'utf-8');
  }

  const out = await execFn(code);
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(cachedFilePath, out);

  return out;
}
