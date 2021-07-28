import chalk from 'chalk';

import { codeMod } from './code-mod';
import { collectCoursework } from './course';
import { storeTex } from './latex';
import {
  customCombinedTransforms,
  htmlCompiler,
  linter,
  markdownParser,
} from './processors';
import { processKnitr } from './r-markdown/knitr';
import { Context, Options } from './types';
import { printReport, reportHasFatalErrors } from './utils/report';
import {
  combineMdastTrees,
  getBuildDir,
  getCacheDir,
  mkdir,
} from './utils/utils';
import { writeHtml } from './utils/write-files';

export async function rMarkdown(dirPath: string, options: Options = {}) {
  const ctx: Context = {
    course: await collectCoursework(dirPath),
    dirPath,
    buildDir: getBuildDir(dirPath),
    cacheDir: getCacheDir(dirPath),
    options,
  };

  if (ctx.buildDir) {
    await mkdir(ctx.buildDir);
  }

  if (ctx.options.week) {
    await createUnit(ctx, ctx.options.week - 1);
  } else {
    for (let idx = 0; idx < ctx.course.units.length; idx++) {
      await createUnit(ctx, idx);
    }
  }
}

async function createUnit(ctx: Context, unitIdx: number) {
  const unit = ctx.course.units[unitIdx];
  try {
    const built = await buildUnit(ctx, unitIdx);
    if (built !== null && ctx.buildDir) {
      await writeHtml(unit.titles.unitName, built.html, ctx.dirPath);
      // await writePdf(titles.unitName, pdfHtml, dirPath);
    }
  } catch (err) {
    console.error(chalk.red(err.message));
    return;
  }
}

export async function buildUnit(ctx: Context, unitIdx: number) {
  const { files } = ctx.course.units[unitIdx];

  // files.forEach((file) => {
  //   console.log(file.contents);
  // });

  ////////////
  // 2 static analysis
  ////////////

  // files.forEach((file) => {
  //   console.log(file.contents);
  //   file.contents = embedLaTeXAsSvg(file.contents as string);
  //   // console.log(file.contents);
  //   file.contents = codeMod(file.contents);
  // });

  // const mdasts = await Promise.all(
  //   files.map((file) => markdownParser(file, ctx))
  // );

  // await Promise.all(
  //   mdasts.map((mdast, idx) => linter(mdast, ctx, files[idx]))
  // );

  // if (!ctx.options.noReport) {
  //   printReport(files, ctx);
  // }
  // if (reportHasFatalErrors(files, ctx)) {
  //   if (ctx.options.noReport) {
  //     const options = { ...ctx.options, reportOnlyErrors: true };
  //     printReport(files, { ...ctx, options });
  //   }
  //   return null;
  // }

  ////////////
  // 3 knitr: Rmarkdown -> markdown
  ////////////

  // needs to re-read original files for easy
  // compatibility with Windows Command Prompt
  await processKnitr(files, ctx);

  // files.forEach((file) => {
  //   file.contents = codeMod(file.contents as string);
  //   file.contents = htmlTexToMml(file.contents as string);
  // });

  const file = files[0];

  let contents = file.contents as string;
  contents = contents.replace(/<\!--.*?-->/g, '');
  contents = codeMod(contents);
  const { store, html: contents2 } = storeTex(contents);

  file.contents = contents2;
  ctx.texStore = store;

  // console.log(file.contents);

  // return;

  // return;

  ////////////
  // 4 markdown -> html
  ////////////

  const mdast = await markdownParser(file, ctx);

  // const mdasts2 = await Promise.all(
  //   markdowns.map((file) => markdownParser(file, ctx))
  // );

  // const mdast = combineMdastTrees(mdasts2);

  await customCombinedTransforms(mdast, ctx);

  const { hast, html } = await htmlCompiler(mdast, ctx, unitIdx);

  // const html2 = htmlMmlToSvg(html);

  ////////////
  // TODO: 5 html with LaTeX -> html with accessible SVGs
  ////////////

  // console.log('before:', html);
  // console.log('INPUT:', `"${html}"`);
  // const html2 = embedLaTeXAsSvg(html);
  // console.log('YER MAW:', html2);

  return { mdast, hast, html: html.replace(/&#x3C;/g, '<') };
}

// function htmlDecode(input: string) {
//   return input;
// }
