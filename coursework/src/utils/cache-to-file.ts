import fs from 'fs';
import path from 'path';

import hashSum from 'hash-sum';

import { Context } from '../types';

type Options = {
  ctx: Context;
  prefix: string;
  key: string;
  execFn: (code: string) => Promise<string>;
};

export async function cacheToFile({ ctx, prefix, key, execFn }: Options) {
  if (ctx.cacheDir === null) {
    return execFn(key);
  }

  const filePath = `${prefix}-${hashSum(key)}.txt`;
  const cachedFilePath = path.join(ctx.cacheDir, filePath);

  if (fs.existsSync(cachedFilePath)) {
    return fs.readFileSync(cachedFilePath, 'utf-8');
  }

  const out = await execFn(key);
  fs.mkdirSync(ctx.cacheDir, { recursive: true });
  fs.writeFileSync(cachedFilePath, out);
  return out;
}
