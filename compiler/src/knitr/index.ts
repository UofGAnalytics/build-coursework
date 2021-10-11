import { exec } from 'child_process';
import path from 'path';

import chalk from 'chalk';
import hashSum from 'hash-sum';
import { VFile } from 'vfile';

import { Context } from '../context';
import { warnMessage } from '../utils/message';
import { mkdir, rmFile, writeFile } from '../utils/utils';

export async function knitr(file: VFile, ctx: Context) {
  const result = await execKnitr(file, ctx);
  file.contents = result;
  return file;
}

// TODO: see what can be done with output when "quiet" in knitr.R is turned off
async function execKnitr(file: VFile, ctx: Context) {
  const filePath = file.path || '';
  const baseDir = file.dirname || '';

  const md = file.contents as string;
  const uniqueId = getUniqueId(md);
  const cachedFilePath = path.join(ctx.cacheDir, `${uniqueId}.Rmd`);
  const cacheDir = path.join(ctx.cacheDir, uniqueId);
  await mkdir(cacheDir);
  await writeFile(cachedFilePath, md);

  return new Promise<string>((resolve, reject) => {
    const rFile = path.join(__dirname, 'knitr.R');
    const cmd = `Rscript ${rFile} ${filePath} ${baseDir}/ "${cacheDir}/"`;
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
      await rmFile(cachedFilePath);
    });
  });
}

function getUniqueId(md: string) {
  const hash = hashSum(md);
  const ts = new Date().getTime().toString();
  return `knitr-${hash}-${ts}`;
}

async function formatResponse(response: string) {
  let md = response;
  md = removeEmptyLog(md);
  md = addErrorCodeBlock(md);
  md = addNewLineAfterKable(md);
  return md;
}

function reportErrors(response: string, file: VFile) {
  response.split('\n').forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('## Error')) {
      warnMessage(file, trimmed.replace('## ', ''), {
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

function addErrorCodeBlock(md: string) {
  return md
    .split('\n')
    .reduce((acc: string[], line) => {
      const prev = acc[acc.length - 1];
      if (line.startsWith('## Error') && prev.startsWith('```')) {
        acc[acc.length - 1] = '```{.error}';
        acc.push(line.replace('## ', ''));
      } else {
        acc.push(line);
      }
      return acc;
    }, [])
    .join('\n');
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
