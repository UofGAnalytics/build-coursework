import { Context } from '../context';
import { Unit } from '../course/types';
import { linter } from '../linter';
import { contextTransforms, syntaxTreeTransforms } from '..';

export async function buildUnit(
  unit: Unit,
  ctx: Context,
  targetPdf?: boolean
) {
  await linter(unit, ctx);
  const transformed = await contextTransforms(unit, ctx);
  const combined = [...unit.files, transformed];
  const md = transformed.contents as string;
  const { mdast, hast, html } = await syntaxTreeTransforms(
    md,
    unit,
    ctx,
    targetPdf
  );
  return { combined, md, mdast, hast, html };
}
