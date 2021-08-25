import { Parent as HastParent } from 'hast';
import { Parent as MdastParent } from 'mdast';
// import { Code } from 'mdast';
// import directive from 'remark-directive';
// import frontmatter from 'remark-frontmatter';
// import gfm from 'remark-gfm';
// import markdown from 'remark-parse';
// import remarkStringify from 'remark-stringify';
// @ts-expect-error
import toVFile from 'to-vfile';
// import unified from 'unified';
// import { Node } from 'unist';
// import visit from 'unist-util-visit';
import { VFile as VFileType } from 'vfile';

import { Context } from './context';
import { Unit } from './course/types';
import { hastPhase } from './hast';
import { htmlPhase } from './html';
import { knitr } from './knitr';
import { texToAliasDirective } from './latex/tex-to-directive';
import { linter, reportErrors } from './linter';
import { mdastPhase2 } from './mdast';
// import { embedAssetUrl } from './mdast/embed-asset-url';
import { convertToPdf } from './pdf';
import { preParsePhase } from './pre-parse';

export type BuiltUnit = {
  unit: Unit;
  combined: VFileType[];
  md: string;
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
  await linter(unit, ctx);

  const mdasts: MdastParent[] = [];
  for (const file of unit.files) {
    await inSituTransforms(file, ctx);
    const mdast = await mdastPhase2(file, ctx);
    mdasts.push(mdast);
  }

  // const transformed = await contextTransforms(unit, ctx);
  // const combined = combineMdFiles(unit);
  // const combined = [...unit.files, transformed];
  // const md = combined.contents as string;

  const mdast = {
    type: 'root',
    children: mdasts.flatMap((o) => o.children),
  };

  const result: BuiltUnit = {
    unit,
    combined: [],
    md: combineMdFiles(unit),
  };

  if (!ctx.options.noHtml) {
    result.html = await syntaxTreeTransforms(mdast, unit, ctx);
  }

  if (!ctx.options.noPdf) {
    const transformed = await syntaxTreeTransforms(mdast, unit, ctx, true);
    result.pdf = {
      ...transformed,
      pdf: await convertToPdf(transformed.html),
    };
  }

  return result;
}

async function inSituTransforms(file: VFileType, ctx: Context) {
  await knitr(file, ctx);
  // console.log(file.contents);
  preParsePhase(file);
  texToAliasDirective(file, ctx);
  // const processor = unified()
  //   // third-party plugins:
  //   .use(markdown)
  //   .use(directive)
  //   .use(gfm)
  //   .use(frontmatter)
  //   .use(remarkStringify, { resourceLink: true })

  //   // custom plugins:
  //   // .use(escapeDollarsInCodeBlocks)
  //   .use(embedAssetUrl);

  // function escapeDollarsInCodeBlocks() {
  //   return async (tree: Node) => {
  //     visit<Code>(tree, 'code', (node) => {
  //       node.value = node.value.replace(/\$/g, '\\$');
  //     });
  //   };
  // }

  // await processor.process(preParsed);
  reportErrors([file], ctx);
  // return mdast;
}

// async function contextTransforms(unit: Unit, ctx: Context) {
//   const file = VFile(unit.files.map((o) => o.contents).join('\n\n'));
//   // const preParsed = preParsePhase(file);
//   const withTexAlias =
//   reportErrors([file], ctx);
//   return withTexAlias;
// }

function combineMdFiles(unit: Unit) {
  return unit.files.map((o) => o.contents).join('\n\n');
}

async function syntaxTreeTransforms(
  mdast: MdastParent,
  unit: Unit,
  ctx: Context,
  targetPdf?: boolean
) {
  // TODO: use the same VFile for each phase!!!
  // const mdast = await mdastPhase(md, unit, ctx, targetPdf);
  const hast = await hastPhase(mdast, unit, ctx, targetPdf);
  const html = await htmlPhase(hast, mdast, unit, ctx, targetPdf);
  // const file = toVFile({ contents: md });
  // reportErrors([file], ctx);
  return { mdast, hast, html };
}
