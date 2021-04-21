import path from 'path';

import hashSum from 'hash-sum';

import { Context } from '../types';
import { checkFileExists, mkdir, readFile, writeFile } from './utils';

type Options = {
  ctx: Context;
  prefix: string;
  key: string;
  execFn: (code: string) => Promise<string | Object>;
  json?: boolean;
};

export async function cacheToFile({
  ctx,
  prefix,
  key,
  execFn,
  json,
}: Options) {
  if (ctx.cacheDir === null) {
    return execFn(key);
  }

  const filePath = `${prefix}-${hashSum(key)}.txt`;
  const cachedFilePath = path.join(ctx.cacheDir, filePath);
  const exists = await checkFileExists(cachedFilePath);
  if (exists) {
    const str = await readFile(cachedFilePath);
    return json ? JSON.parse(str) : str;
  }

  const out = await execFn(key);
  const str = json ? JSON.stringify(out, null, 2) : (out as string);
  await mkdir(ctx.cacheDir);
  await writeFile(cachedFilePath, str);
  return out;
}

export async function cacheJsonToFile(options: Options) {
  return cacheToFile({ ...options, json: true });
}
