import { exec } from 'child_process';
import { EOL } from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

import chalk from 'chalk';
import hashSum from 'hash-sum';
import { VFile } from 'vfile';

import { Context } from '../context';
import { Unit } from '../course/types';
import { warnMessage } from '../utils/message';
import { mkdir, rmFile, writeFile } from '../utils/utils';

export async function knitr(unit: Unit, ctx: Context) {
  const parentFile = await createParentFile(unit, ctx);

  const result = await execKnitr(parentFile, ctx);
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
    const directive = `:directory[${fileDir}]`;

    // child document
    // escape backslash path on windows
    const formattedPath = path
      .relative(ctx.cacheDir, filePath)
      .replace(/\\/g, '\\\\');

    const childCodeBlock = `\`\`\`{r, child='${formattedPath}'}${EOL}\`\`\``;
    return acc + directive + EOL + EOL + childCodeBlock + EOL + EOL;
  }, '');

  file.value = value;
  return file;
}

// TODO: see what can be done with output when "quiet" in knitr.R is turned off
async function execKnitr(file: VFile, ctx: Context) {
  const md = file.value as string;
  const uniqueId = getUniqueId(md);
  const cachedFile = path.join(ctx.cacheDir, `${uniqueId}.Rmd`);
  const cacheDir = path.join(ctx.cacheDir, uniqueId);
  await mkdir(cacheDir);
  await writeFile(cachedFile, md);

  return new Promise<string>((resolve, reject) => {
    const cmd = createKnitrCommand(file, ctx, uniqueId);

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
      await rmFile(cachedFile);
    });
  });
}

function getUniqueId(md: string) {
  const hash = hashSum(md);
  const ts = new Date().getTime().toString();
  return `knitr-${hash}-${ts}`;
}

function createKnitrCommand(file: VFile, ctx: Context, uniqueId: string) {
  const rFileDir = getKnitrFileDir();
  const rFile = path.join(rFileDir, 'knitr.R');
  const baseDir = path.parse(ctx.course.units[0].unitPath).dir; // TODO
  const cachedFile = path.join(ctx.cacheDir, `${uniqueId}.Rmd`);
  const cacheDir = path.join(ctx.cacheDir, uniqueId);
  return `Rscript "${rFile}" "${cachedFile}" "${baseDir}/" "${cacheDir}/"`;
}

function getKnitrFileDir() {
  // temporary hack until this PR is merged
  // https://github.com/webpack/webpack/pull/15246
  if (process.env.NODE_ENV === 'production') {
    return __dirname;
  }
  return path.dirname(fileURLToPath(import.meta.url));
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
  md = removeCustomPythonBinNotice(md);
  md = addCodeBlockClasses(md);
  md = addErrorCodeBlock(md);
  md = removeHashSigns(md);
  md = removeEmptyLog(md);
  md = addNewLineAfterKable(md);
  return md;
}

function removeCustomPythonBinNotice(md: string) {
  return md.replace(/^\$python\s\[1\]\s"\S+"/, '');
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

function removeHashSigns(md: string) {
  let insideCodeResponse = false;
  let openingLine = '';
  return md
    .split('\n')
    .reduce((acc: string[], line) => {
      if (line.startsWith('```')) {
        insideCodeResponse = !insideCodeResponse;
        openingLine = insideCodeResponse ? line : '';
      }
      if (insideCodeResponse && openingLine.endsWith('-output}')) {
        acc.push(line.replace(/^##\s+/, ''));
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
      if (line.startsWith('## Error') && acc[idx - 1].startsWith('```')) {
        const lang = findLanguageForOutput(acc.slice(0, -1));
        acc[acc.length - 1] = `\`\`\`{.${lang}-error-output}`;
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
