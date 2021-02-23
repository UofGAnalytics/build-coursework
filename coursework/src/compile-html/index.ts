import { Node } from 'hast';
import unified from 'unified';
import remark2rehype from 'remark-rehype';
import doc from 'rehype-document';
import stringify from 'rehype-stringify';

// @ts-expect-error
import format from 'rehype-format';

import { getTemplateCss, getTemplateJs } from '../util';
import { addWrapper } from './add-wrapper';

type Options = {
  courseTitle: string;
  unitTitle: string;
};

export async function compileHtml(files: Node[], opts: Options) {
  const options = {
    title: `${opts.unitTitle} | ${opts.courseTitle}`,
    style: `\n${await getTemplateCss()}\n`,
    script: `\n${await getTemplateJs()}\n`,
  };

  const processor = unified()
    .use(remark2rehype)
    .use(addWrapper, opts)
    // .use(inspect())
    .use(doc, options)
    .use(format)
    .use(stringify);

  const combined = {
    type: 'root',
    children: files.flatMap((d) => d.children || []),
  };
  const transformed = await processor.run(combined);
  return processor.stringify(transformed);
}

// function inspect() {
//   return () => (tree: Node) => {
//     console.dir(obj, { depth: null });
//     // visit(tree, 'code', (node) => {
//     //   console.log('---------------------');
//     //   console.dir(obj, { depth: null });
//     // });
//     return tree;
//   };
// }
