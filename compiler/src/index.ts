import path from 'path';

import chalk from 'chalk';

import { Context, Options, createContext } from './context';
import { Unit } from './course/types';
import { hastPhase } from './hast';
import { htmlPhase } from './html';
import { knitr } from './knitr';
import { texToAliasDirective } from './latex/tex-to-directive';
import { linter } from './linter';
import { mdastPhase } from './mdast';
import { convertToPdf } from './pdf';
import { preParsePhase } from './pre-parse';
import { createTimer } from './utils/timer';
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
  const ctx = await createContext(dirPath, options);

  // write single week
  if (ctx.options.week) {
    const idx = ctx.options.week - 1;
    const unit = ctx.course.units[idx];
    await writeUnit(unit, ctx);
    return;
  }

  // write full course
  for (const unit of ctx.course.units) {
    await writeUnit(unit, ctx);
  }
}

async function writeUnit(unit: Unit, ctx: Context) {
  await linter(unit, ctx);
  const md = await contextTransforms(unit, ctx);
  await mkdir(ctx.buildDir);
  const filePath = path.join(ctx.buildDir, unit.titles.fileName);

  if (!ctx.options.noHtml) {
    const timer = createTimer();
    const { html } = await syntaxTreeTransforms(md, unit, ctx);
    await writeFile(filePath + '.html', html);
    const seconds = timer.stop();
    const status = chalk.green.bold(`Complete in ${seconds}s`);
    console.log(`✨ ${status} ${filePath}.html`);
  }

  if (!ctx.options.noPdf) {
    const timer = createTimer();
    const { html } = await syntaxTreeTransforms(md, unit, ctx, true);

    // testing
    await writeFile(filePath + '.pdf.html', html);

    const pdf = await convertToPdf(html);
    await writeFile(filePath + '.pdf', pdf);

    const seconds = timer.stop();
    const status = chalk.green.bold(`Complete in ${seconds}s`);
    console.log(`✨ ${status} ${filePath}.pdf`);
  }
}

export async function buildUnit(
  unit: Unit,
  ctx: Context,
  targetPdf?: boolean
) {
  await linter(unit, ctx);
  const md = await contextTransforms(unit, ctx);
  const { mdast, hast, html } = await syntaxTreeTransforms(
    md,
    unit,
    ctx,
    targetPdf
  );
  return { md, mdast, hast, html };
}

async function contextTransforms(unit: Unit, ctx: Context) {
  const combined = unit.files.map((o) => o.contents).join('\n\n');
  const md = preParsePhase(combined, ctx);
  const withKnitr = await knitr(md, ctx);
  return texToAliasDirective(withKnitr, ctx);
}

async function syntaxTreeTransforms(
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
