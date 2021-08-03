// import parser from 'fast-xml-parser';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { MathDocument } from 'mathjax-full/js/core/MathDocument';
import * as MathItem from 'mathjax-full/js/core/MathItem';
import { SerializedMmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';
import { mathjax } from 'mathjax-full/js/mathjax.js';

import { Context } from '../context';

// Extract all LaTeX using MathJax "page" process (doesn't need delimiters).
// https://github.com/mathjax/MathJax-demos-node/blob/f70342b69533dbc24b460f6d6ef341dfa7856414/direct/tex2mml-page

// Convert Tex to alias and build ctx.mmlStore
// (Alias is replaced with SVG in ./directive-to-svg in mdast phase)

// Avoids typesetting issues:
// If I leave the LaTeX in it gets munged
// If I convert to SVG it gets munged
// If I convert to MathML it gets munged

export function texToAliasDirective(html: string, ctx: Context) {
  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);

  const tex = new TeX({
    packages: AllPackages.filter((name) => name !== 'bussproofs'), // Busproofs requires an output jax
    tags: 'ams',
    inlineMath: [['$', '$']],
    processEscapes: true,
  });

  const visitor = new SerializedMmlVisitor();

  const store: string[] = [];

  function storeTex({ math }: MathDocument<any, any, any>) {
    const items = Array.from(math);

    for (const item of items) {
      // convert to MML
      const mml = visitor.visitTree(item.root);

      let newMarkdown = '';
      if (isReferenceLink(item.math)) {
        // convert tex to text link
        const refNum = extractRefNumFromMml(mml);
        const anchor = extractAnchorLinkFromMml(mml);
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

  // add store to ctx.mmlStore
  ctx.mmlStore = store;

  const doc = mathjax.document(html, {
    InputJax: tex,
    renderActions: {
      typeset: [MathItem.STATE.TYPESET, storeTex],
    },
  });
  doc.render();
  const result = adaptor.innerHTML(adaptor.body(doc.document));
  return unprotectHtml(result);
}

function isReferenceLink(tex: string) {
  return /^\\ref\{(.+)\}$/.test(tex);
}

function extractAnchorLinkFromMml(mml: string) {
  const match = mml.match(/<mrow href="(.+)" class="MathJax_ref">/);
  if (match === null) {
    throw new Error(`Mml has no anchor link: ${mml}`);
  }
  return match[1] as string;
}

function extractRefNumFromMml(mml: string) {
  const match = mml.match(/<mtext>(\d+)<\/mtext>/);
  if (match === null) {
    throw new Error(`Mml has no reference number: ${mml}`);
  }
  return match[1] as string;
}

// https://github.com/mathjax/MathJax-src/blob/41565a97529c8de57cb170e6a67baf311e61de13/ts/adaptors/lite/Parser.ts#L399-L403
function unprotectHtml(html: string) {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}
