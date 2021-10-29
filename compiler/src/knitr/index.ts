import { exec } from 'child_process';
import path from 'path';

import chalk from 'chalk';
import chardet from 'chardet';
import hashSum from 'hash-sum';
import iconv from 'iconv-lite';
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
  const md = file.contents as string;
  const uniqueId = getUniqueId(md);
  const cachedFilePath = path.join(ctx.cacheDir, `${uniqueId}.Rmd`);
  const cacheDir = path.join(ctx.cacheDir, uniqueId);
  await mkdir(cacheDir);
  await writeFile(cachedFilePath, md);

  return new Promise<string>((resolve, reject) => {
    const cmd = createKnitrCommand(file, ctx, uniqueId, cachedFilePath);

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

function createKnitrCommand(
  file: VFile,
  ctx: Context,
  uniqueId: string,
  cachedFilePath: string
) {
  const baseDir = file.dirname || '';
  const rFile = path.join(__dirname, 'knitr.R');
  const cacheDir = path.join(ctx.cacheDir, uniqueId);
  let cmd = `Rscript ${rFile} ${cachedFilePath} ${baseDir}/ "${cacheDir}/"`;

  if (ctx.options.pythonBin) {
    cmd += ` "${ctx.options.pythonBin}"`;
  }

  return cmd;
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

async function formatResponse(response: string) {
  let md = response;
  console.log('encoding:', chardet.detect(Buffer.from(response)));
  // md = iconv.decode(Buffer.from(response), 'win1251');
  md = removeHashSigns(md);
  md = addCodeBlockClasses(md);
  md = removeEmptyLog(md);
  md = addErrorCodeBlock(md);
  md = addNewLineAfterKable(md);
  return md;
}

function removeHashSigns(md: string) {
  let insideCodeBlock = false;
  return md
    .split('\n')
    .reduce((acc: string[], line) => {
      if (line.startsWith('```')) {
        insideCodeBlock = !insideCodeBlock;
      }
      if (insideCodeBlock) {
        acc.push(line.replace(/^##\s+/, ''));
      } else {
        acc.push(line);
      }
      return acc;
    }, [])
    .join('\n');
}

function addCodeBlockClasses(md: string) {
  return md
    .split('\n')
    .reduce((acc: string[], line) => {
      if (line.startsWith('```{.knitr-output}')) {
        const lang = findLanguageForOutput(acc);
        acc.push(`\`\`\`{.${lang}-output}`);
      } else {
        acc.push(line);
      }
      return acc;
    }, [])
    .join('\n');
}

function removeEmptyLog(md: string) {
  return md.replace(/\[1\]\s""$/gm, '').trim();
}

function addErrorCodeBlock(md: string) {
  return md
    .split('\n')
    .reduce((acc: string[], line, idx) => {
      if (line.startsWith('Error') && acc[idx - 1].startsWith('```')) {
        const lang = findLanguageForOutput(acc.slice(0, -1));
        acc[acc.length - 1] = `\`\`\`{.${lang}-error}`;
      }
      acc.push(line);
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

function findLanguageForOutput(prev: string[]) {
  const pattern = /```(\w*)/;
  const reversed = prev.slice().reverse();
  const prevClosingIdx = reversed.findIndex((s) => s.startsWith('```'));
  const prevOpening = reversed
    .slice(prevClosingIdx + 1)
    .find((s) => pattern.test(s)) as string;

  if (!prevOpening) {
    return 'r';
  }

  const match = prevOpening.match(pattern) as RegExpMatchArray;
  return match[1];
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
