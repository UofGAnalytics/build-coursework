import { Parent as HastParent } from 'hast';
import { Parent as MdastParent } from 'mdast';
import VFile, { VFile as VFileType } from 'vfile';

import { Context } from './context';
import { Unit } from './course/types';
import { hastPhase } from './hast';
import { htmlPhase } from './html';
import { knitr } from './knitr';
import { texToAliasDirective } from './latex/tex-to-directive';
import { createReport, reportErrors } from './linter';
// import { warnOnIncludeGraphics } from './linter/warn-on-include-graphics';
import { mdastPhase } from './mdast';
import { combinedMdastPhase } from './mdast/combined';
import { convertToPdf } from './pdf';
import { preParsePhase } from './pre-parse';

export type BuiltUnit = {
  unit: Unit;
  md: string;
  files: VFileType[];
  html?: {
    mdast: MdastParent;
    hast: HastParent;
    html: string;
  };
  pdf?: {
    mdast: MdastParent;
    hast: HastParent;
    html: string;
    pdf: Buffer;
  };
};

export async function buildUnit(unit: Unit, ctx: Context) {
  const mdasts: MdastParent[] = [];
  for (const file of unit.files) {
    const mdast = await inSituTransforms(file, ctx);
    await createReport(file, mdast, ctx);
    mdasts.push(mdast);
  }

  const unifiedFile = VFile();

  const result: BuiltUnit = {
    unit,
    md: combineMdFiles(unit),
    files: [...unit.files, unifiedFile],
  };

  const mdast = combineMdastTrees(mdasts);
  if (!ctx.options.noHtml) {
    result.html = await syntaxTreeTransforms(
      mdast,
      unifiedFile,
      unit,
      ctx
    );
  }

  if (!ctx.options.noPdf) {
    const transformed = await syntaxTreeTransforms(
      mdast,
      unifiedFile,
      unit,
      ctx,
      true
    );
    result.pdf = {
      ...transformed,
      pdf: await convertToPdf(transformed.html),
    };
  }

  if (!ctx.options.noReport) {
    reportErrors(result.files, ctx);
  }

  return result;
}

async function inSituTransforms(file: VFileType, ctx: Context) {
  await knitr(file, ctx);
  preParsePhase(file);
  texToAliasDirective(file, ctx);
  return mdastPhase(file, ctx);
}

function combineMdFiles(unit: Unit) {
  return unit.files.map((o) => o.contents).join('\n\n');
}

function combineMdastTrees(mdasts: MdastParent[]) {
  return {
    type: 'root',
    children: mdasts.flatMap((o) => o.children),
  };
}

async function syntaxTreeTransforms(
  _mdast: MdastParent,
  file: VFileType,
  unit: Unit,
  ctx: Context,
  targetPdf?: boolean
) {
  const mdast = await combinedMdastPhase(_mdast, ctx, file, targetPdf);
  const hast = await hastPhase(mdast, ctx, file, targetPdf);
  const html = await htmlPhase(hast, mdast, file, unit, ctx, targetPdf);
  return { mdast, hast, html };
}
