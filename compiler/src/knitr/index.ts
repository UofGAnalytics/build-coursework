import { exec } from 'child_process';
import path from 'path';

import chalk from 'chalk';
// import hashSum from 'hash-sum';
import { VFile } from 'vfile';

import { Context } from '../context';
import { failMessage } from '../utils/message';

export async function knitr(file: VFile, ctx: Context) {
  const md = file.contents as string;
  // console.log(cwd);
  const result = await execKnitr(md, ctx, file);
  file.contents = result;
  return file;
}

// TODO: see what can be done with output when "quiet" turned off
async function execKnitr(md: string, ctx: Context, file: VFile) {
  const filePath = path.join(file.cwd, file.path || '');
  const baseDir = path.join(file.cwd, file.dirname || '');

  return new Promise<string>((resolve, reject) => {
    const rFile = path.join(__dirname, 'knitr.R');
    const cmd = `Rscript ${rFile} ${filePath} ${baseDir}/ ${ctx.cacheDir}/`;
    exec(cmd, async (err, response, stdErr) => {
      if (stdErr) {
        console.log(chalk.grey(`[knitr] ${stdErr.trim()}`));
      }
      if (err) {
        console.error('ERROR', err);
        reject(err);
      } else {
        reportErrors(response, file);
        resolve(formatResponse(response));
      }
    });
  });
}

// function getUniqueTempFileName(md: string) {
//   const hash = hashSum(md);
//   const ts = new Date().getTime().toString();
//   return `knitr-${hash}-${ts}.Rmd`;
// }

async function formatResponse(response: string) {
  let result = response;
  result = removeEmptyLog(result);
  result = addNewLineAfterKable(result);
  return result;
}

function reportErrors(response: string, file: VFile) {
  response.split('\n').forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('## Error')) {
      failMessage(file, trimmed.replace('##', ''), {
        start: {
          line: idx + 1,
          column: 0,
        },
        end: {
          line: idx + 1,
          column: line.length,
        },
      });
    }
  });
}

function removeEmptyLog(md: string) {
  return md.replace(/\[1\]\s""$/gm, '').trim();
}

function addNewLineAfterKable(md: string) {
  return md
    .split('\n')
    .reduce((acc: string[], line, idx) => {
      if (acc[idx - 1]?.startsWith('|') && !line.startsWith('|')) {
        acc.push('', line);
      } else {
        acc.push(line);
      }
      return acc;
    }, [])
    .join('\n');
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
