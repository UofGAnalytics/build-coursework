import path from 'path';

import chalk from 'chalk';

import { BuiltUnit, buildUnit } from './build-unit';
import { Context, Options, createContext } from './context';
import { Timer, createTimer } from './utils/timer';
import { mkdir, writeFile } from './utils/utils';

export async function rMarkdown(dirPath: string, options: Options = {}) {
  const timer = createTimer();
  const ctx = await createContext(dirPath, options);

  const result = [];

  if (ctx.options.week) {
    // write single week
    const idx = ctx.options.week - 1;
    const input = ctx.course.units[idx];
    const built = await buildUnit(input, ctx);
    await writeUnit(built, ctx, timer);
    result.push(built);
  } else {
    // write full course
    for (const input of ctx.course.units) {
      const built = await buildUnit(input, ctx);
      await writeUnit(built, ctx, timer);
      result.push(built);
    }
  }

  return result;
}

async function writeUnit(built: BuiltUnit, ctx: Context, timer: Timer) {
  if (ctx.options.noWrite) {
    return;
  }

  await mkdir(ctx.buildDir);
  const filePath = path.join(ctx.buildDir, built.unit.titles.fileName);

  if (built.html) {
    await writeFile(filePath + '.html', built.html.html);
    const status = chalk.green.bold(`Complete in ${timer.seconds()}s`);
    console.log(`✨ ${status} ${filePath}.html`);
  }

  if (built.pdf) {
    await writeFile(filePath + '.pdf', built.pdf.pdf);

    // debug
    // await writeFile(filePath + '.pdf.html', built.pdf.html);

    const status = chalk.green.bold(`Complete in ${timer.seconds()}s`);
    console.log(`✨ ${status} ${filePath}.pdf`);
  }
}
