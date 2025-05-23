import { exec } from 'child_process';
import { EOL } from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

import chalk from 'chalk';
import hashSum from 'hash-sum';
import { VFile } from 'vfile';

import { Context } from '../context';
import { Unit } from '../course/types';
import { failMessage, infoMessage, warnMessage } from '../utils/message';
import { mkdir, rmFile, writeFile } from '../utils/utils';

// bypass knitr for debugging
// export async function knitr(unit: Unit, ctx: Context) {
//   const file = new VFile();
//   file.value = unit.files.reduce((acc, o) => {
//     return acc + EOL + EOL + o.value;
//   }, '');
//   return file;
// }

export async function knitr(unit: Unit, ctx: Context) {
  const parentFile = await createParentFile(unit, ctx);
  // console.log(parentFile.value);

  const result = await execKnitr(parentFile, ctx, unit.unitPath);
  // console.log(result);
  parentFile.value = result;
  return parentFile;
}

// creating a temporary file which includes all child files allows
// R/Python state to be shared across multiple .Rmd files
// https://yihui.org/knitr/options/#child-documents
async function createParentFile(unit: Unit, ctx: Context) {
  const file = new VFile();

  let value = '';

  // pass path to custom python binary to reticulate
  // https://rstudio.github.io/reticulate/articles/r_markdown.html
  if (ctx.options.pythonBin) {
    const reticulate = `reticulate::use_python("${ctx.options.pythonBin}")`;
    value += `\`\`\`{r, echo=FALSE}${EOL}${reticulate}${EOL}\`\`\`${EOL}${EOL}`;
  }

  value += unit.files.reduce((acc, o) => {
    const [filePath] = o.history;

    // directory directive is used to ensure external assets
    // can have relative paths to the .Rmd document.
    // used in embed-asset-url mdast transform
    const fileDir = path.parse(filePath).dir;
    const directive = `::directory[${fileDir}]`;

    // child document
    // convert all file paths to forward slash (windows anaconda/knitr bug)
    const formattedPath = filePath.replace(/\\/g, '/');

    const childCodeBlock = `\`\`\`{r, child='${formattedPath}'}${EOL}\`\`\``;
    return acc + directive + EOL + EOL + childCodeBlock + EOL + EOL;
  }, '');

  // console.log(value);

  file.value = value;
  return file;
}

async function execKnitr(file: VFile, ctx: Context, unitPath: string) {
  const md = file.value as string;
  const uniqueId = getUniqueId(md);
  const cachedFile = path.join(ctx.cacheDir, `${uniqueId}.Rmd`);
  const cacheDir = path.join(ctx.cacheDir, uniqueId);
  await mkdir(cacheDir);
  await writeFile(cachedFile, md);

  return new Promise<string>((resolve, reject) => {
    const cmd = createKnitrCommand(ctx, uniqueId, unitPath);
    const maxBuffer = 1024 * 1024 * 10;

    exec(cmd, { maxBuffer }, async (err, response, stdErr) => {
      if (stdErr) {
        if (!ctx.options.output) {
          console.log(chalk.grey(`[knitr] ${stdErr.trim()}`));
        }
        if (isFailingStdErr(stdErr)) {
          failMessage(file, stdErr);
        }
      }

      if (err) {
        console.error('ERROR', err);
        reject(err);
      } else {
        reportErrors(response, file, ctx);
        resolve(formatResponse(response));
      }
      await rmFile(cachedFile);
    });
  });
}

function getUniqueId(md: string) {
  const hash = hashSum(md);
  const ts = new Date().getTime().toString();
  return `knitr-${hash}-${ts}`;
}

function createKnitrCommand(
  ctx: Context,
  uniqueId: string,
  unitPath: string,
) {
  const rFileDir = getKnitrFileDir();
  const rFile = path.join(rFileDir, 'knitr.R');
  const baseDir = path.parse(unitPath).dir;
  const cachedFile = path.join(ctx.cacheDir, `${uniqueId}.Rmd`);
  const cacheDir = path.join(ctx.cacheDir, uniqueId);

  // spawn args
  // return [rFile, cachedFile, baseDir, cacheDir];

  return `Rscript "${rFile}" "${cachedFile}" "${baseDir}" "${cacheDir}"`;
}

function getKnitrFileDir() {
  // temporary hack until this PR is merged
  // https://github.com/webpack/webpack/pull/15246
  if (process.env.NODE_ENV === 'production') {
    return __dirname;
  }
  return path.dirname(fileURLToPath(import.meta.url));
}

function isFailingStdErr(stdErr: string) {
  // console.log({ stdErr });
  return /status 1\d*$/.test(stdErr.trim());
}

function reportErrors(response: string, file: VFile, ctx: Context) {
  const lines = response
    .split(EOL)
    .filter((s) => !s.startsWith(':directory'));

  const trimmed = lines.join(EOL).trim();

  // Warning at the start of a document
  if (trimmed.startsWith('WARNING -')) {
    const match = trimmed.match(/^WARNING - (.+?)[\r\n]{2,}/ms);

    // Check the original file doesn't start with WARNING
    const original = String(ctx.course.units[0].files[0].value)
      .split(EOL)
      .filter((s) => !s.startsWith(':directory'))
      .join(EOL)
      .trim();

    if (match !== null && !original.startsWith('WARNING -')) {
      warnMessage(file, match[1], {
        start: {
          line: 1,
          column: 0,
        },
        end: {
          line: 1,
          column: lines[0].length,
        },
      });
    }

    // Python binary path
  } else if (trimmed.startsWith('$python [1]')) {
    const match = trimmed.match(/^\$python\s\[1\]\s("\S+")/);
    if (match !== null) {
      infoMessage(file, match[1], {
        start: {
          line: 1,
          column: 0,
        },
        end: {
          line: 1,
          column: lines[0].length,
        },
      });
    }
  }

  // Errors throughout document
  lines.forEach((line, idx) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('## Error')) {
      warnMessage(file, trimmedLine.replace('## ', ''), {
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
  md = removeCustomPythonBinNotice(md);
  md = removePythonWarningMessage(md);
  md = addErrorCodeBlock(md);
  md = removeHashSigns(md);
  md = removeEmptyLog(md);
  md = addNewLineAfterKable(md);
  md = removeSpaceBeforeCodeLanguage(md);
  md = replaceSupHtmlWithLatex(md);
  return md;
}

function removeCustomPythonBinNotice(md: string) {
  return md.replace(/^\$python\s\[1\]\s"\S+"/, '');
}

function removePythonWarningMessage(md: string) {
  return md.replace(/^WARNING - .+?[\r\n]+/m, '');
}

function removeHashSigns(md: string) {
  let insideCodeResponse = false;
  let openingLine = '';
  return md
    .split('\n') // note: leave as \n instead of EOL
    .reduce((acc: string[], line) => {
      const trimmed = line.trimEnd();
      if (trimmed.startsWith('```')) {
        insideCodeResponse = !insideCodeResponse;
        openingLine = insideCodeResponse ? trimmed : '';
      }
      if (insideCodeResponse && openingLine.endsWith('-output')) {
        acc.push(trimmed.replace(/^##\s+/, ''));
      } else {
        acc.push(trimmed);
      }
      return acc;
    }, [])
    .join(EOL);
}

function removeEmptyLog(md: string) {
  return md.replace(/\[1\]\s""$/gm, '').trim();
}

function addErrorCodeBlock(md: string) {
  return md
    .split(EOL)
    .reduce((acc: string[], line, idx) => {
      // console.log(line);
      if (idx > 0 && acc[idx - 1].startsWith('```')) {
        if (line.startsWith('## Error') || line.startsWith('## fatal')) {
          acc[acc.length - 1] = `\`\`\`error-output`;
        }
      }
      acc.push(line);
      return acc;
    }, [])
    .join(EOL);
}

function addNewLineAfterKable(md: string) {
  return md
    .split(EOL)
    .reduce((acc: string[], line, idx) => {
      if (acc[idx - 1]?.startsWith('|') && !line.startsWith('|')) {
        acc.push('', line);
      } else {
        acc.push(line);
      }
      return acc;
    }, [])
    .join(EOL);
}

function removeSpaceBeforeCodeLanguage(md: string) {
  return md.replace(/^```\s(.+)$/g, '```$1');
}

function replaceSupHtmlWithLatex(md: string) {
  return md.replace(/<sup>(.+?)<\/sup>/g, '^{$1}');
}

// experimental streaming output
// async function spawnKnitr(file: VFile, ctx: Context, unitPath: string) {
//   const md = file.value as string;
//   const uniqueId = getUniqueId(md);
//   const cachedFile = path.join(ctx.cacheDir, `${uniqueId}.Rmd`);
//   const cacheDir = path.join(ctx.cacheDir, uniqueId);
//   await mkdir(cacheDir);
//   await writeFile(cachedFile, md);

//   return new Promise<string>((resolve, reject) => {
//     const args = createKnitrCommand(ctx, uniqueId, unitPath);
//     const knitr = spawn('Rscript', args);
//     const result: string[] = [];

//     knitr.stdout.on('data', (data) => {
//       const str = data.toString();
//       console.log(str);
//       result.push(str);
//     });

//     knitr.stdout.on('end', () => {
//       console.log('STDOUT END');
//       const end = result.join('');
//       console.log('END', end);
//       reportErrors(end, file);
//       resolve(formatResponse(end));
//     });

//     knitr.stdout.on('error', (err) => {
//       console.log('STDOUT ERROR', err, err.toString());
//       reject();
//     });

//     knitr.stderr.on('data', (data) => {
//       const str = data.toString();
//       console.log('STDERR ERROR', str);
//     });
//   }).then(async (result) => {
//     await rmFile(cachedFile);
//     return result;
//   });
// }
