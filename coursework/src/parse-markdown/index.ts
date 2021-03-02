import { VFile } from 'vfile';
import unified from 'unified';
import markdown from 'remark-parse';
import math from 'remark-math';
import directive from 'remark-directive';
import { video } from './youtube-video';
import { boxout } from './boxout';
// import { taskAnswer } from './task-answer';

// @ts-expect-error
import embedImages from 'remark-embed-images';

export async function parseMarkdown(file: VFile, dirPath: string) {
  const processor = unified()
    .use(markdown)
    .use(embedImages)
    .use(directive)
    // .use(inspect)
    .use(math)
    .use(boxout)
    .use(video, dirPath);
  // .use(taskAnswer);

  const parsed = processor.parse(file);
  return processor.run(parsed, file);
}

// function inspect() {
//   return (tree: Node) => {
//     // console.dir(tree, { depth: null });
//     visit(tree, 'leafDirective', (node) => {
//       if (node.name === 'video') {
//       }
//       console.log('---------------------');
//       console.dir(node, { depth: null });
//     });
//     return tree;
//   };
// }
