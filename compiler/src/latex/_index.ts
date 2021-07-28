import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { MathDocument } from 'mathjax-full/js/core/MathDocument';
import * as MathItem from 'mathjax-full/js/core/MathItem';
import { SerializedMmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { MathML } from 'mathjax-full/js/input/mathml.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { SVG } from 'mathjax-full/js/output/svg.js';

import { createAccessibleSvg } from '../transforms-mdast/accessible-tex';
import { rehypeParser } from '../utils/utils';
import { mmlToSpeech, mmlToSvg } from './mathjax-tex';

export function htmlTexToMml(html: string) {
  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);
  const packages = AllPackages.filter((name) => name !== 'bussproofs');
  const tex = new TeX({
    packages,
    tags: 'ams',
    inlineMath: [['$', '$']],
    processEscapes: true,
  });
  const renderActions = {
    typeset: [MathItem.STATE.TYPESET, renderMml],
  };
  const doc = mathjax.document(html, { renderActions, InputJax: tex });
  doc.render();
  const result = adaptor.innerHTML(adaptor.body(doc.document));
  return unprotectHtml(result);
}

// https://github.com/mathjax/MathJax-src/blob/41565a97529c8de57cb170e6a67baf311e61de13/ts/adaptors/lite/Parser.ts#L399-L403
function unprotectHtml(html: string) {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function renderMml({ math, adaptor }: MathDocument<any, any, any>) {
  for (const item of Array.from(math)) {
    // console.log(item.math);

    const mml = visitor.visitTree(item.root);
    const svg = renderSvg(mml);
    const tree = adaptor.parse(svg, 'text/html');
    item.typesetRoot = adaptor.firstChild(adaptor.body(tree));
  }
}

export function htmlMmlToSvg(html: string) {
  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);
  const mathml = new MathML();
  const svg = new SVG({ fontCache: 'local' });
  const doc = mathjax.document(html.replace(/&#x3C;/g, '<'), {
    InputJax: mathml,
    OutputJax: svg,
  });
  doc.render();
  return adaptor.innerHTML(adaptor.body(doc.document));
}
