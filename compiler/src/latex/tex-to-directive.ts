import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { MathDocument } from 'mathjax-full/js/core/MathDocument';
import * as MathItem from 'mathjax-full/js/core/MathItem';
import { SerializedMmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { VFile } from 'vfile';

import { Context } from '../context';
import { assertNoTexTabular } from '../linter/assert-no-tex-tabular';
import { failMessage } from '../utils/message';

// This custom MathJax implementation has had to diverge from the provided demos found
// here: https://github.com/mathjax/MathJax-demos-node, because they are all concerned
// with MathJax embedded in HTML whereas at this stage in the processor we're dealing
// with Markdown.  Due to TeX/LaTeX making heavy use of the backslash (\) character,
// we need to deal with it early as it conflicts with other libraries used later.

// I Extract all LaTeX using MathJax "page" process as it doesn't need delimiters and
// stores context required for numbered references. (Based on direct/tex2mml-page).
// However this has a naive HTML handler which will munge HTML (and Python) in some
// cases so I am careful to only mutate TeX within delimiters and leave the rest of
// the Markdown alone.

// I replace the TeX with a placeholder such as :inlineMath[21] or :blockMath[42].
// I convert the TeX to MathML which is more robust and store it memory for use
// later (in directive-to-svg.ts).

// Avoids typesetting issues:
// If I leave the LaTeX in it gets munged
// If I convert to SVG it gets munged
// If I convert to MathML it gets munged

export function texToAliasDirective(file: VFile, ctx: Context) {
  // simple regex tests
  assertNoTexTabular(file);

  const md = file.contents as string;
  const tex = new TeX({
    // Bussproofs requires an output jax
    packages: AllPackages.filter((name) => name !== 'bussproofs'),
    tags: 'ams',
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)'],
    ],
    displayMath: [
      ['$$', '$$'],
      [`\\[`, `\\]`],
    ],
  });

  const store = buildMmlStore(md, tex);

  const result = tex
    .findMath([md])
    .map((item, idx) => ({ ...item, idx }))
    .reverse()
    .reduce((acc, item) => {
      const mml = store[item.idx];
      assertNoMmlError(mml, file);

      // debug
      // console.log(item.math, mml);

      let newMarkdown = '';

      if (item.math === '$') {
        // escaped dollar sign...
        newMarkdown = '$';
      } else if (item.math === '\\') {
        // double backslash...
        newMarkdown = '\\\\';
      } else if (isReferenceLink(item.math)) {
        // reference link...
        const refNum = extractRefNumFromMml(mml, item.math, file);
        const anchor = extractAnchorLinkFromMml(mml, item.math);
        newMarkdown = `[${refNum}](${anchor})`;
      } else {
        // equation...
        const type = item.display ? 'blockMath' : 'inlineMath';
        newMarkdown = `:${type}[${item.idx}]`;
      }

      const prev = acc.slice(0, item.start.n);
      const next = acc.slice(item.end.n);
      return prev + newMarkdown + next;
    }, md);

  // add store to ctx
  ctx.mmlStore = store;

  file.contents = postParse(result);
  return file;
}

function buildMmlStore(md: string, tex: TeX<unknown, unknown, unknown>) {
  const store: string[] = [];

  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);
  const visitor = new SerializedMmlVisitor();

  function storeMml({ math }: MathDocument<any, any, any>) {
    for (const item of Array.from(math)) {
      // convert to MML
      const mml = visitor.visitTree(item.root);
      store.push(mml);

      const tree = adaptor.parse('**unused**', 'text/html');
      item.typesetRoot = adaptor.firstChild(adaptor.body(tree));
    }
  }

  const doc = mathjax.document(md, {
    InputJax: tex,
    renderActions: {
      typeset: [MathItem.STATE.TYPESET, storeMml],
    },
  });

  doc.render();

  return store;
}

function assertNoMmlError(mml: string, file: VFile) {
  const match = mml.match(/<merror.*?title="(.+?)"/);
  if (match !== null) {
    failMessage(file, `LaTeX error: "${match[1]}".`);
  }
}

function isReferenceLink(tex: string) {
  return /^\\ref\{(.+)\}$/.test(tex);
}

function extractRefNumFromMml(mml: string, tex: string, file: VFile) {
  const match = mml.match(/<mtext>(.+)<\/mtext>/);
  if (match === null) {
    failMessage(file, `Invalid reference: ${tex}`);
    return;
  }
  if (match[1] === '???') {
    failMessage(
      file,
      `Invalid reference: ${tex}. You may only reference numbered sections.`
    );
  }
  return match[1] as string;
}

function extractAnchorLinkFromMml(mml: string, tex: string) {
  const match = mml.match(/<mrow href="(.+)" class="MathJax_ref">/);
  if (match === null) {
    throw new Error(`Reference has no anchor link: ${tex}`);
  }
  return decodeURIComponent(match[1] || '') as string;
}

function postParse(html: string) {
  let result = html;
  // result = unprotectHtml(result);
  result = removeUnresolvedLabels(result);
  // result = removeUnnecessaryHtmlClosingTags(result);
  return result;
}

function removeUnresolvedLabels(html: string) {
  return html.replace(/\\label{def:.*?}/gm, '');
}
