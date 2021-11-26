import {
  LiteAdaptor,
  liteAdaptor,
} from 'mathjax-full/js/adaptors/liteAdaptor.js';
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
// import { assertNoTexTabular } from '../linter/assert-no-tex-tabular';
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

type ExtractedMath = {
  start: number;
  end: number;
  mml: string;
  tex: string;
  display: boolean;
};

export function texToAliasDirective(file: VFile, ctx: Context) {
  // simple regex tests
  assertNoTexTabular(file);

  const md = file.contents as string;

  const store = buildMmlStore(md);
  const result = replaceTexWithPlaceholder(md, store, file);

  // add store to ctx
  ctx.mmlStore = store.map((o) => o.mml);

  // replace md in VFile
  file.contents = postParse(result);

  return file;
}

// This is based on https://github.com/mathjax/MathJax-demos-node/blob/f70342b69533dbc24b460f6d6ef341dfa7856414/direct/tex2mml-page
// except I don't return the HTML, instead I compile a list of the extracted LaTeX converted to MathML
function buildMmlStore(md: string) {
  const store: ExtractedMath[] = [];

  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);
  const visitor = new SerializedMmlVisitor();

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
    renderActions: {
      typeset: [MathItem.STATE.TYPESET, storeMml(adaptor, visitor, store)],
    },
    // wrap verbatim latex with <div class="mathjax-ignore"></div>
    ignoreHtmlClass: 'mathjax-ignore',
  });

  doc.render();

  return store;
}

function storeMml(
  adaptor: LiteAdaptor,
  visitor: SerializedMmlVisitor,
  store: ExtractedMath[]
) {
  return ({ math }: MathDocument<any, any, any>) => {
    for (const item of Array.from(math)) {
      if (item.start.n === undefined) {
        throw new Error('start is undefined');
      }
      if (item.end.n === undefined) {
        throw new Error('end is undefined');
      }

      store.push({
        start: item.start.n,
        end: item.end.n,
        tex: item.math,
        display: item.display,
        // convert to MML
        mml: visitor.visitTree(item.root),
      });

      // this is only necessary for the MathJax "typeset"
      // renderAction to complete without error
      const tree = adaptor.parse('**unused**', 'text/html');
      item.typesetRoot = adaptor.firstChild(adaptor.body(tree));
    }
  };
}

function replaceTexWithPlaceholder(
  md: string,
  store: ExtractedMath[],
  file: VFile
) {
  // Replace it with a placeholder for use later
  return store
    .map((item, idx) => ({ ...item, idx }))
    .reverse()
    .reduce((acc, item) => {
      const placeholder = createPlaceholder(item, file);
      const prev = acc.slice(0, item.start);
      const next = acc.slice(item.end);
      return prev + placeholder + next;
    }, md);
}

type ExtractedMathWithIdx = ExtractedMath & {
  idx: number;
};

function createPlaceholder(item: ExtractedMathWithIdx, file: VFile) {
  // escaped dollar sign...
  if (item.tex === '$') {
    return '$';
  }

  // double backslash...
  if (item.tex === '\\') {
    return '\\\\';
  }

  assertNoMmlError(item.mml, file);

  // debug
  // console.log(item);

  // reference link...
  if (isReferenceLink(item.tex)) {
    const refNum = extractRefNumFromMml(item, file);
    const anchor = extractAnchorLinkFromMml(item, file);
    return `[${refNum}](${anchor})`;
  }

  // normal use case (equation)...
  const type = item.display ? 'blockMath' : 'inlineMath';
  return `:${type}[${item.idx}]`;
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

function extractRefNumFromMml({ mml, tex }: ExtractedMath, file: VFile) {
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

function extractAnchorLinkFromMml(
  { mml, tex }: ExtractedMath,
  file: VFile
) {
  const match = mml.match(/<mrow href="(.+)" class="MathJax_ref">/);
  if (match === null) {
    failMessage(file, `Reference has no anchor link: ${tex}`);
    return;
  }
  return decodeURIComponent(match[1] || '') as string;
}

function postParse(html: string) {
  let result = html;
  result = removeUnresolvedLabels(result);
  return result;
}

function removeUnresolvedLabels(html: string) {
  return html.replace(/\\label{def:.*?}/gm, '');
}
