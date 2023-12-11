import { exec } from 'child_process';
import path from 'path';

import dargs from 'dargs';

import { Options } from '../context';

export async function fixtureTestProcessor(
  fixture: string,
  options: Options = {},
) {
  const flags = dargs(
    {
      noDoc: true,
      noCache: true,
      noPdf: true,
      noReport: true,
      noWrite: true,
      noEmbedAssets: true,
      output: 'md',
      verbose: true,
      ...options,
    },
    { allowCamelCase: true },
  );

  return new Promise<string>((resolve, reject) => {
    const fixturePath = path.join('./fixtures', fixture);
    const cmd = `rmarkdown ${fixturePath} ${flags.join(' ')}`;

    exec(cmd, { maxBuffer: 1000 * 1000 * 10 }, (err, response, stdErr) => {
      // console.log({ err, response, stdErr });
      if (stdErr) {
        if (!options.shouldFail) {
          console.log(stdErr);
        }
        reject(stdErr);
      }
      if (err) {
        if (!options.shouldFail) {
          console.error(err);
        }
        reject(err);
      }
      resolve(response);
    });
  });
}
