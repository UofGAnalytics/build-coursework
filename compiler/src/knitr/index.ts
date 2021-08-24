import { exec } from 'child_process';
import path from 'path';

import chalk from 'chalk';
import hashSum from 'hash-sum';
import { Code } from 'mdast';
import directive from 'remark-directive';
import frontmatter from 'remark-frontmatter';
import gfm from 'remark-gfm';
import markdown from 'remark-parse';
import remarkStringify from 'remark-stringify';
import unified from 'unified';
import { Node } from 'unist';
import visit from 'unist-util-visit';
import { VFile } from 'vfile';

import { Context } from '../context';
import { mkdir, rmFile, writeFile } from '../utils/utils';

export async function knitr(file: VFile, ctx: Context) {
  const md = file.contents as string;
  const result = await execKnitr(md, ctx);
  file.contents = result;
  return file;
}

// TODO: see what can be done with output when "quiet" turned off
async function execKnitr(md: string, ctx: Context) {
  const fileName = getUniqueTempFileName(md);
  const cachedFilePath = path.join(ctx.cacheDir, fileName);

  await mkdir(ctx.cacheDir);
  await writeFile(cachedFilePath, md);

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

async function formatResponse(response: string) {
  let result = response;
  result = removeEmptyLog(result);
  result = addNewLineAfterKable(result);
  result = await escapeDollarSymbolsInR(result);
  return result;
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

// mini syntax tree processor just to escape dollar signs in embedded R code...
async function escapeDollarSymbolsInR(md: string) {
  const processor = unified()
    .use(markdown)
    .use(directive)
    .use(gfm)
    .use(frontmatter)
    .use(codeBlocks)
    .use(remarkStringify, { unsafe: [], resourceLink: true });

  const processed = await processor.process(md);
  return processed.contents as string;
}

function codeBlocks() {
  return async (tree: Node) => {
    visit<Code>(tree, 'code', (node) => {
      node.value = node.value.replace(/\$/g, '\\$');
    });
  };
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
