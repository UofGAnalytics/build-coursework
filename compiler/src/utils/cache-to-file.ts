import path from 'path';

import hashSum from 'hash-sum';

import { Context } from '../types';
import { checkLocalFileExists, mkdir, readFile, writeFile } from './utils';

type Options = {
  ctx: Context;
  prefix: string;
  key: string;
  execFn: (code: string) => Promise<string | Object>;
  json?: boolean;
};

export async function cacheToFile(options: Options) {
  const { ctx, prefix, key, execFn, json } = options;

  if (ctx.options.noCache === true) {
    return execFn(key);
  }

  const filePath = `${prefix}-${hashSum(key)}.txt`;
  const cachedFilePath = path.join(ctx.cacheDir, filePath);
  const exists = await checkLocalFileExists(cachedFilePath);

  if (exists) {
    const str = await readFile(cachedFilePath);

    // auto-heal corrupt json
    if (json) {
      try {
        return JSON.parse(str);
      } catch (err) {
        return execAndCache(options, cachedFilePath);
      }
    }

    return str;
  }

  return execAndCache(options, cachedFilePath);
}

export async function cacheJsonToFile(options: Options) {
  return cacheToFile({ ...options, json: true });
}

async function execAndCache(
  { ctx, key, execFn, json }: Options,
  cachedFilePath: string
) {
  const out = await execFn(key);
  const str = json ? JSON.stringify(out, null, 2) : (out as string);
  await mkdir(ctx.cacheDir);
  await writeFile(cachedFilePath, str);
  return out;
}
