import path from 'path';

import chalk from 'chalk';
import VFile from 'vfile';

import { Context, Options, createContext } from './context';
import { Unit } from './course/types';
import { hastPhase } from './hast';
import { htmlPhase } from './html';
import { knitr } from './knitr';
import { texToAliasDirective } from './latex/tex-to-directive';
import { linter, reportErrors } from './linter';
import { printReport } from './linter/report';
// import { printReport } from './linter/report';
import { mdastPhase } from './mdast';
import { convertToPdf } from './pdf';
import { preParsePhase } from './pre-parse';
import { Timer, createTimer } from './utils/timer';
import { mkdir, writeFile } from './utils/utils';

export async function rMarkdown(dirPath: string, options: Options = {}) {
  return run(dirPath, options);
  // try {
  //   await run(dirPath, options);
  // } catch (err) {
  //   console.log(err.message);
  // }
}

async function run(dirPath: string, options: Options = {}) {
  const timer = createTimer();
  const ctx = await createContext(dirPath, options);

  // write single week
  if (ctx.options.week) {
    const idx = ctx.options.week - 1;
    const unit = ctx.course.units[idx];
    await writeUnit(unit, ctx, timer);
    return;
  }

  // write full course
  for (const unit of ctx.course.units) {
    await writeUnit(unit, ctx, timer);
  }
}

async function writeUnit(unit: Unit, ctx: Context, timer: Timer) {
  await mkdir(ctx.buildDir);
  const filePath = path.join(ctx.buildDir, unit.titles.fileName);

  await linter(unit, ctx);

  const transformed = await contextTransforms(unit, ctx);

  const combined = [...unit.files, transformed];
  printReport(combined, ctx);
  reportErrors(combined, ctx);

  const md = transformed.contents as string;

  if (!ctx.options.noHtml) {
    const { html } = await syntaxTreeTransforms(md, unit, ctx);
    await writeFile(filePath + '.html', html);

    const status = chalk.green.bold(`Complete in ${timer.seconds()}s`);
    console.log(`✨ ${status} ${filePath}.html`);
  }

  if (!ctx.options.noPdf) {
    const { html } = await syntaxTreeTransforms(md, unit, ctx, true);
    const pdf = await convertToPdf(html);
    await writeFile(filePath + '.pdf', pdf);

    // debug
    // await writeFile(filePath + '.pdf.html', html);

    const status = chalk.green.bold(`Complete in ${timer.seconds()}s`);
    console.log(`✨ ${status} ${filePath}.pdf`);
  }
}

export async function contextTransforms(unit: Unit, ctx: Context) {
  const file = VFile(unit.files.map((o) => o.contents).join('\n\n'));
  const preParsed = preParsePhase(file);
  const withKnitr = await knitr(preParsed, ctx);
  const withTexAlias = texToAliasDirective(withKnitr, ctx);
  // printReport([withTexAlias], ctx);
  // return withTexAlias.contents as string;
  return withTexAlias;
}

export async function syntaxTreeTransforms(
  md: string,
  unit: Unit,
  ctx: Context,
  targetPdf?: boolean
) {
  const mdast = await mdastPhase(md, unit, ctx, targetPdf);
  const hast = await hastPhase(mdast, unit, ctx, targetPdf);
  const html = await htmlPhase(hast, mdast, unit, ctx, targetPdf);
  return { mdast, hast, html };
}
