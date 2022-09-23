import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { MathDocument } from 'mathjax-full/js/core/MathDocument.js';
import * as MathItem from 'mathjax-full/js/core/MathItem.js';
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
// here: https://github.com/mathjax/MathJax-demos-node, because they are all focused on
// either converting LaTeX on its own or (referencing "page" demos) LaTeX embedded in
// HTML, whereas at this stage in the processor we're dealing with LaTeX embedded in
// Markdown. Due to TeX/LaTeX making heavy use of the backslash (\) character, we need
// to deal with it early as it conflicts with other libraries used later.

// I use the MathJax "page" process as it will pick up LaTeX even without delimiters
// and stores context required for numbered references (based on direct/tex2mml-page).
// However this has a naive HTML handler which will munge HTML (and Python) in some
// cases so I am careful to only mutate TeX and leave the rest of the Markdown alone.

// I replace the TeX with a placeholder formatted as a Markdown directive, for example
// :inlineMath[21] or :blockMath[42].

// I convert the TeX to MathML and store it memory for use later (in directive-to-svg.ts).

export function texToAliasDirective(file: VFile, ctx: Context) {
  // simple regex tests
  assertNoTexTabular(file);

  const md = file.value as string;
  const store: string[] = [];
  const adaptor = liteAdaptor();
  const visitor = new SerializedMmlVisitor();
  RegisterHTMLHandler(adaptor);

  const doc = mathjax.document(md, {
    InputJax: new TeX({
      // Bussproofs requires an output jax
      packages: AllPackages.filter((name) => name !== 'bussproofs'),
      // Allow numbered references
      tags: 'ams',
      // Allow single $ delimiters
      inlineMath: [
        ['$', '$'],
        ['\\(', '\\)'],
      ],
      displayMath: [
        ['$$', '$$'],
        [`\\[`, `\\]`],
      ],
    }),
    // wrap verbatim latex with <div class="mathjax-ignore"></div>
    ignoreHtmlClass: 'mathjax-ignore',
    renderActions: {
      typeset: [
        MathItem.STATE.TYPESET,
        ({ math }: MathDocument<any, any, any>) => {
          for (const item of Array.from(math)) {
            let newMarkdown = '';

            // convert to MathML
            const mml = visitor.visitTree(item.root);
            assertNoMmlError(mml, file);

            // escaped dollar sign...
            if (item.math === '$') {
              newMarkdown = '$';
            }

            // double backslash...
            else if (item.math === '\\') {
              newMarkdown = '\\\\';
            }

            // reference link...
            else if (isReferenceLink(item.math)) {
              const refNum = extractRefNumFromMml(mml, item.math, file);
              const anchor = extractAnchorLinkFromMml(
                mml,
                item.math,
                file
              );
              newMarkdown = `[${refNum}](${anchor})`;
            }

            // normal use case (equation)...
            else {
              store.push(mml);
              const type = item.display ? 'blockMath' : 'inlineMath';
              newMarkdown = `:${type}[${store.length - 1}]`;
            }

            const tree = adaptor.parse(newMarkdown, 'text/html');
            item.typesetRoot = adaptor.firstChild(adaptor.body(tree));
          }
        },
      ],
    },
  });

  // add store to ctx
  ctx.mmlStore = store;

  doc.render();

  // replace md in VFile
  const result = adaptor.innerHTML(adaptor.body(doc.document));
  file.value = postParse(result);

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

function extractAnchorLinkFromMml(mml: string, tex: string, file: VFile) {
  const match = mml.match(/<mrow href="(.+)" class="MathJax_ref">/);
  if (match === null) {
    failMessage(file, `Reference has no anchor link: ${tex}`);
    return;
  }
  return decodeURIComponent(match[1] || '') as string;
}

function postParse(html: string) {
  let result = html.trim();
  result = unprotectHtml(result);
  result = removeUnresolvedLabels(result);
  result = removeHTMLClosingTags(result);
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

function removeHTMLClosingTags(html: string) {
  return html.replace(/(<\/\S+>)+$/, '');
}
