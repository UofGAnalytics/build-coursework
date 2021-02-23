import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';
import { SerializedMmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js';
import { STATE } from 'mathjax-full/js/core/MathItem.js';

// @ts-expect-error
import { toSpeech } from 'speech-rule-engine';

export function convertLatex(latex: string) {
  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);

  const doc = mathjax.document('', {
    InputJax: new TeX({ packages: AllPackages }),
    OutputJax: new SVG({ fontCache: 'local' }),
  });

  // svg output
  const node = doc.convert(latex, {
    display: true,
    em: 16,
    ex: 8,
    containerWidth: 80 * 16,
  });
  const svg = adaptor.outerHTML(node);

  // mml output
  const visitor = new SerializedMmlVisitor();
  const node2 = doc.convert(latex, { end: STATE.CONVERT });
  const mml = visitor.visitTree(node2);

  // arial label output
  const label = toSpeech(mml);

  return { mml, svg, label };
}
