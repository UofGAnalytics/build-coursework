import { exec } from 'child_process';
import path from 'path';

import dargs from 'dargs';

import { Options } from '../context';

export async function fixtureTestProcessor(
  fixture: string,
  options: Options = {}
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
    { allowCamelCase: true }
  );

  return new Promise<string>((resolve, reject) => {
    const fixturePath = path.join('./fixtures', fixture);
    const cmd = `rmarkdown ${fixturePath} ${flags.join(' ')}`;

    exec(cmd, (err, response, stdErr) => {
      if (stdErr) {
        console.log(stdErr);
        reject(stdErr);
      }
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(response);
    });
  });
}
