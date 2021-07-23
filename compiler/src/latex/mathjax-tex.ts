import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { STATE } from 'mathjax-full/js/core/MathItem.js';
import { SerializedMmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { HTMLDocument } from 'mathjax-full/js/handlers/html/HTMLDocument.js';
import { MathML } from 'mathjax-full/js/input/mathml.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
// @ts-expect-error
import { toSpeech } from 'speech-rule-engine';

export function texToMml(tex: string = '') {
  const packages = AllPackages.filter((name) => name !== 'bussproofs');
  const adaptor = liteAdaptor();
  const input = new TeX({ packages });
  const doc = new HTMLDocument('', adaptor, { InputJax: input });
  const node = doc.convert(tex, { end: STATE.CONVERT });
  const visitor = new SerializedMmlVisitor();
  return visitor.visitTree(node);
}

export function mmlToSvg(mml: string) {
  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);
  const input = new MathML();
  const output = new SVG({ fontCache: 'local' });
  const doc = mathjax.document('', { InputJax: input, OutputJax: output });
  const node = doc.convert(mml, { em: 25 });
  return adaptor.outerHTML(node);
}

export function mmlToSpeech(mml: string) {
  return toSpeech(mml);
}
