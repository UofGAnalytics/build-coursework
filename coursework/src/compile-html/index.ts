import { Node } from 'hast';
import unified from 'unified';
import remark2rehype from 'remark-rehype';
import doc from 'rehype-document';
import visit from 'unist-util-visit';
import stringify from 'rehype-stringify';

// @ts-expect-error
import format from 'rehype-format';

import { getTemplateCss, getTemplateJs } from '../util';
import { addWrapper } from './add-wrapper';
// import { taskAnswer } from '../parse-markdown/task-answer';

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
    .use(moveAnswersToEnd)
    .use(remark2rehype)
    // .use(taskAnswer)
    .use(addWrapper, opts)
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
//   return (tree: Node) => {
//     console.dir(tree, { depth: null });
//     // visit(tree, 'containerDirective', (node, index, parent) => {
//     //   console.log('---------------------');
//     //   console.dir(node, { depth: null });
//     // });
//     return tree;
//   };
// }

function moveAnswersToEnd() {
  return (tree: Node) => {
    visit(tree, 'containerDirective', (node, index, parent) => {
      if (node.name === 'answer') {
        const parentChildren = parent?.children || ([] as Node[]);
        parentChildren.splice(index, 1);
        const treeChildren = tree.children as Node[];
        treeChildren.push(node);
      }
    });
    return tree;
  };
}
