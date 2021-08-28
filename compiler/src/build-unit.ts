import { Parent as HastParent } from 'hast';
import { Parent as MdastParent } from 'mdast';
import VFile, { VFile as VFileType } from 'vfile';

import { Context } from './context';
import { Unit } from './course/types';
import { hastPhase } from './hast';
import { htmlPhase } from './html';
import { knitr } from './knitr';
import { texToAliasDirective } from './latex/tex-to-directive';
import { createReport2, reportErrors } from './linter';
import { assertNoKbl } from './linter/assert-no-kbl';
import { assertNoTexTabular } from './linter/assert-no-tex-tabular';
import { warnOnIncludeGraphics } from './linter/warn-on-include-graphics';
import { mdastPhase2 } from './mdast';
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
    await createReport2(file, mdast, ctx);
    mdasts.push(mdast);
  }

  const mdast = combineMdastTrees(mdasts);
  const unifiedFile = VFile();

  const result: BuiltUnit = {
    unit,
    md: combineMdFiles(unit),
    files: [...unit.files, unifiedFile],
  };

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
  // simple regex tests
  assertNoTexTabular(file);
  assertNoKbl(file);
  warnOnIncludeGraphics(file);

  await knitr(file, ctx);
  preParsePhase(file);
  texToAliasDirective(file, ctx);
  const mdast = await mdastPhase2(file, ctx);
  return mdast;
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
  mdast: MdastParent,
  file: VFileType,
  unit: Unit,
  ctx: Context,
  targetPdf?: boolean
) {
  const hast = await hastPhase(mdast, ctx, file, targetPdf);
  const html = await htmlPhase(hast, mdast, file, unit, ctx, targetPdf);
  return { mdast, hast, html };
}
