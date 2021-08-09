import { exec } from 'child_process';
import path from 'path';

import chalk from 'chalk';
import hashSum from 'hash-sum';

import { Context } from '../context';
import { mkdir, rmFile, writeFile } from '../utils/utils';

export async function knitr(md: string, ctx: Context) {
  const fileName = getUniqueTempFileName(md);
  const cachedFilePath = path.join(ctx.cacheDir, fileName);

  await mkdir(ctx.cacheDir);
  await writeFile(cachedFilePath, md);

  // TODO:
  // * see what can be done with output when "quiet" turned off

  return new Promise<string>((resolve, reject) => {
    const rFile = path.join(__dirname, 'knitr.R');
    const cmd = `Rscript ${rFile} ${cachedFilePath} ${ctx.cacheDir}/`;
    exec(cmd, async (err, response, stdErr) => {
      if (stdErr) {
        console.log(chalk.grey(`[knitr] ${stdErr.trim()}`));
      }
      if (err) {
        console.error('ERROR', err);
        reject(err);
      } else {
        resolve(formatResponse(response));
      }
      await rmFile(cachedFilePath);
    });
  });
}

function getUniqueTempFileName(md: string) {
  const hash = hashSum(md);
  const ts = new Date().getTime().toString();
  return `knitr-${hash}-${ts}.Rmd`;
}

function formatResponse(response: string) {
  return response.replace(/\[1\]\s""$/m, '').trim();
}

// attempt at changing knitr output. doesn't completely work
// const hooks = `
//   knit_hooks$set(
//     source = function(x, options) {
//       paste(c("\`\`\`r", x, "\`\`\`"), collapse = "\n")
//     },
//     output = function(x, options) {
//       paste(c("\`\`\`", x, "\`\`\`"), collapse = "\n")
//     },
//     error = function(x, options) {
//       paste(
//         c(
//           "\`\`\`plaintext error",
//           gsub("## Error", "\#\# Error", x),
//           "\`\`\`"
//         ),
//         collapse = "\n"
//       )
//     }
//   )
// `;
