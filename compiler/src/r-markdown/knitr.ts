import { exec } from 'child_process';
import path from 'path';

import { VFile } from 'vfile';

import { Context } from '../types';

export async function processKnitr(files: VFile[], ctx: Context) {
  return Promise.all(
    files.map(async (file) => {
      file.contents = await knitr(file.path as string, ctx);
      return file;
    })
  );
}

async function knitr(filePath: string, ctx: Context) {
  return new Promise<string>((resolve, reject) => {
    const rFile = path.join(__dirname, 'knitr.R');
    const cmd = `Rscript ${rFile} ${filePath} ${ctx.cacheDir}/`;
    exec(cmd, (err, response, stdErr) => {
      if (stdErr) {
        console.error('STDERR', stdErr);
        reject(stdErr);
      } else if (err) {
        console.error('ERROR', err);
        reject(err);
      } else {
        resolve(formatResponse(response));
      }
    });
  });
}

function formatResponse(response: string) {
  return response.replace(/\[1\]\s""$/m, '').trim();
}

// attempts at changing knitr output. doesn't completely work
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
