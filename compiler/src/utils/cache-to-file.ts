import path from 'path';

import hashSum from 'hash-sum';

import { Context } from '../context';
import { checkLocalFileExists, mkdir, readFile, writeFile } from './utils';

type Options = {
  ctx: Context;
  prefix: string;
  key: string;
  execFn: (code: string) => Promise<string>;
  json?: boolean;
};

export async function cacheToFile(options: Options): Promise<string> {
  const { ctx, prefix, key, execFn, json } = options;

  if (ctx.options.noCache === true) {
    return execFn(key);
  }

  const filePath = `${prefix}-${hashSum(key)}.txt`;
  const cachedFilePath = path.join(ctx.cacheDir, filePath);
  const exists = await checkLocalFileExists(cachedFilePath);

  if (exists) {
    const str = await readFile(cachedFilePath);

    // ignore cache if json is corrupt
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
  cachedFilePath: string,
) {
  try {
    const out = (await execFn(key)) as string;
    const str = json ? JSON.stringify(out, null, 2) : out;
    await mkdir(ctx.cacheDir);
    await writeFile(cachedFilePath, str);
    return out;
  } catch (err) {
    return '';
  }
}
