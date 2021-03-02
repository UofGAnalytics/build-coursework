import { VFile } from 'vfile';
import { Node } from 'hast';
import unified from 'unified';
import { lintLatex } from './lint-latex';

// import styleGuide from 'remark-preset-lint-markdown-style-guide';

// @ts-expect-error
import lintAltText from '@double-great/remark-lint-alt-text';
// @ts-expect-error
import lintLinkText from '@mapbox/remark-lint-link-text';
// @ts-expect-error
import report from 'vfile-reporter-pretty';
// @ts-expect-error
import remark2retext from 'remark-retext';
// @ts-expect-error
import dictionary from 'dictionary-en-gb';
// @ts-expect-error
import english from 'retext-english';
// @ts-expect-error
import spell from 'retext-spell';

const remarkProcessor = unified()
  .use(lintLinkText)
  .use(lintAltText)
  .use(lintLatex);

const retextProcessor = unified().use(
  remark2retext,
  unified().use(english).use(spell, dictionary) //.use(inspect)
);

export async function linter(hasts: Node[], files: VFile[]) {
  await Promise.all(
    hasts.map((hast, idx) => remarkProcessor.run(hast, files[idx]))
  );

  await Promise.all(
    hasts.map((hast, idx) => retextProcessor.run(hast, files[idx]))
  );

  console.log(report(files));
}

// function inspect() {
//   return (tree: Node) => {
//     console.dir(tree, { depth: null });
//     // visit(tree, 'leafDirective', (node) => {
//     //   if (node.name === 'video') {
//     //   }
//     //   console.log('---------------------');
//     //   console.dir(node, { depth: null });
//     // });
//     return tree;
//   };
// }
