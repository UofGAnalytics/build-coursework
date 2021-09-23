// import parser from 'fast-xml-parser';

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
import { assertNoKbl } from '../linter/assert-no-kbl';
import { assertNoTexTabular } from '../linter/assert-no-tex-tabular';
import { failMessage } from '../utils/message';

// Extract all LaTeX using MathJax "page" process (doesn't need delimiters).
// https://github.com/mathjax/MathJax-demos-node/blob/f70342b69533dbc24b460f6d6ef341dfa7856414/direct/tex2mml-page

// Convert Tex to directive alias ie. :blockMath[13] or :inlineMath[42] and build ctx.mmlStore array
// (Alias is replaced with SVG in ./directive-to-svg.ts in mdast phase)

// Avoids typesetting issues:
// If I leave the LaTeX in it gets munged
// If I convert to SVG it gets munged
// If I convert to MathML it gets munged

export function texToAliasDirective(file: VFile, ctx: Context) {
  // simple regex tests
  assertNoTexTabular(file);

  const md = file.contents as string;
  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);

  const tex = new TeX({
    packages: AllPackages.filter((name) => name !== 'bussproofs'), // Busproofs requires an output jax
    tags: 'ams',
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)'],
    ],
    displayMath: [
      ['$$', '$$'],
      [`\\[`, `\\]`],
    ],
    processEscapes: true,
    // ignoreClass: 'r-output',
  });

  const visitor = new SerializedMmlVisitor();

  const store: string[] = [];

  function storeTexAndDisplayAlias({ math }: MathDocument<any, any, any>) {
    const items = Array.from(math);

    for (const item of items) {
      // debug
      // console.log(item.math);

      let newMarkdown = '';

      // convert to MML
      const mml = visitor.visitTree(item.root);
      assertNoMmlError(mml, file);

      // escaped dollar sign...
      if (item.math === '$') {
        newMarkdown = '$';
      } else if (item.math === '\\') {
        newMarkdown = '\\\\';
      } else if (isReferenceLink(item.math)) {
        // convert tex to text link
        const refNum = extractRefNumFromMml(mml, item.math, file);
        const anchor = extractAnchorLinkFromMml(mml, item.math);
        newMarkdown = `[${refNum}](${anchor})`;
      } else {
        // insert alias as a custom directive and build store of mml
        store.push(mml);
        const type = item.display ? 'blockMath' : 'inlineMath';
        const idx = store.length - 1;
        newMarkdown = `:${type}[${idx}]`;
      }

      const tree = adaptor.parse(newMarkdown, 'text/html');
      item.typesetRoot = adaptor.firstChild(adaptor.body(tree));
    }
  }

  // add store to ctx
  ctx.mmlStore = store;

  const doc = mathjax.document(md, {
    InputJax: tex,
    renderActions: {
      typeset: [MathItem.STATE.TYPESET, storeTexAndDisplayAlias],
    },
  });
  doc.render();
  const result = adaptor.innerHTML(adaptor.body(doc.document));
  file.contents = postParse(result);
  return file;
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
  result = unprotectHtml(result);
  result = removeUnresolvedLabels(result);
  return result;
}

// https://github.com/mathjax/MathJax-src/blob/41565a97529c8de57cb170e6a67baf311e61de13/ts/adaptors/lite/Parser.ts#L399-L403
function unprotectHtml(html: string) {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function removeUnresolvedLabels(html: string) {
  return html.replace(/\\label{def:.*?}/gm, '');
}
