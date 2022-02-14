import { Parent as HastParent } from 'hast';
import { Parent as MdastParent, Root } from 'mdast';
import { VFile } from 'vfile';

import { Context } from './context';
import { Unit } from './course/types';
import { hastPhase } from './hast';
import { htmlPhase } from './html';
import { knitr } from './knitr/knitr';
import { texToAliasDirective } from './latex/tex-to-directive';
import { createReport, reportErrors } from './linter';
import { mdastPhase } from './mdast';
import { combinedMdastPhase } from './mdast/combined';
import { convertToPdf } from './pdf';
import { preParsePhase } from './pre-parse';

export type BuiltUnit = {
  unit: Unit;
  md: string;
  files: VFile[];
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
  const unifiedFile = await knitr(unit, ctx);

  const mdast = (await inSituTransforms(unifiedFile, ctx)) as Root;
  // console.log(mdast);

  await createReport(unifiedFile, mdast, ctx);

  const result: BuiltUnit = {
    unit,
    md: combineMdFiles(unifiedFile),
    files: [unifiedFile],
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

async function inSituTransforms(file: VFile, ctx: Context) {
  preParsePhase(file);
  texToAliasDirective(file, ctx);
  return mdastPhase(file, ctx);
}

function combineMdFiles(file: VFile) {
  return removeDirectoryLines(file.value as string);
}

function removeDirectoryLines(md: string) {
  return md
    .split('\n')
    .filter((line) => !/^:directory\[.+\]$/.test(line))
    .join('\n');
}

async function syntaxTreeTransforms(
  _mdast: Root,
  file: VFile,
  unit: Unit,
  ctx: Context,
  targetPdf?: boolean
) {
  const mdast = await combinedMdastPhase(_mdast, ctx, file, targetPdf);
  const hast = (await hastPhase(
    mdast,
    ctx,
    file,
    targetPdf
  )) as HastParent;
  const html = await htmlPhase(hast, mdast, file, unit, ctx, targetPdf);
  return { mdast, hast, html };
}
