import { Context, Options, createContext } from './context';
import { Unit } from './course/types';
import { hastPhase } from './hast';
import { htmlPhase } from './html';
import { markdownPhase } from './markdown';
import { mdastPhase } from './mdast';
// import { writeHtml } from './utils/write-files';

export async function rMarkdown(dirPath: string, options: Options = {}) {
  const ctx = await createContext(dirPath, options);

  // write single week
  if (ctx.options.week) {
    const idx = ctx.options.week - 1;
    const unit = ctx.course.units[idx];
    return writeUnit(unit, ctx);
  }

  // write full course
  return Promise.all(
    ctx.course.units.map((unit) => {
      return writeUnit(unit, ctx);
    })
  );
}

async function writeUnit(unit: Unit, ctx: Context) {
  if (!ctx.options.noHtml) {
    const { html } = await buildUnit(unit, ctx);
    console.log(html);
    // await writeHtml(unit.titles.unitName, html, ctx.dirPath);
  }
  if (!ctx.options.noPdf) {
    console.log('write pdf!');
    // const { html } = await buildUnit(unit, ctx, true);
    // const pdf = convertToPdf(html)
    // await writePdf(unit.titles.unitName, pdf, ctx.dirPath);
  }
}

export async function buildUnit(
  unit: Unit,
  ctx: Context,
  targetPdf?: boolean
) {
  const combined = unit.files.map((o) => o.contents).join('\n\n');
  const md = await markdownPhase(combined, ctx);
  const mdast = await mdastPhase(md, ctx, targetPdf);
  const hast = await hastPhase(mdast, unit, ctx);
  const html = await htmlPhase(hast, unit, ctx);
  return { md, mdast, hast, html };
}
