import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { MathDocument } from 'mathjax-full/js/core/MathDocument';
import * as MathItem from 'mathjax-full/js/core/MathItem';
import { SerializedMmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';
import { mathjax } from 'mathjax-full/js/mathjax.js';

export function storeTex(html: string) {
  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);

  const tex = new TeX({
    packages: AllPackages.filter((name) => name !== 'bussproofs'),
    tags: 'ams',
    inlineMath: [['$', '$']],
    processEscapes: true,
  });

  const visitor = new SerializedMmlVisitor();

  const store: string[] = [];

  function storeTex({ math }: MathDocument<any, any, any>) {
    const items = Array.from(math);
    for (const item of items) {
      store.push(visitor.visitTree(item.root));

      const type = item.display ? 'block' : 'inline';
      const idx = store.length - 1;
      const directive = `:${type}Math[${idx}]`;
      const tree = adaptor.parse(directive, 'text/html');
      item.typesetRoot = adaptor.firstChild(adaptor.body(tree));
    }
  }

  const renderActions = {
    typeset: [MathItem.STATE.TYPESET, storeTex],
  };
  const doc = mathjax.document(html, { InputJax: tex, renderActions });
  doc.render();
  const result = adaptor.innerHTML(adaptor.body(doc.document));
  return {
    store,
    html: unprotectHtml(result),
  };
}

// https://github.com/mathjax/MathJax-src/blob/41565a97529c8de57cb170e6a67baf311e61de13/ts/adaptors/lite/Parser.ts#L399-L403
function unprotectHtml(html: string) {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}
