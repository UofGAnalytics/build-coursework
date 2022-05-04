import { spawn } from 'child_process';
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
    const args = [path.join('./fixtures', fixture), ...flags];
    const rmarkdown = spawn('rmarkdown', args);

    const result: string[] = [];

    rmarkdown.stdout.on('data', (data) => {
      const str = data.toString();

      if (str.startsWith('✖')) {
        return reject(str);
      }

      result.push(str);
    });

    rmarkdown.stdout.on('end', () => {
      resolve(result.join(''));
    });

    rmarkdown.stderr.on('data', (data) => {
      reject(data.toString());
    });
  });
}
