import { VFile } from 'vfile';
import { Node } from 'hast';
import unified from 'unified';
import { customCodeOutput } from './custom-code-output';

export async function codeBlocks(
  mdasts: Node[],
  files: VFile[],
  dirPath: string
) {
  const processor = unified().use(customCodeOutput, dirPath);

  await Promise.all(
    mdasts.map((mdast, idx) => processor.run(mdast, files[idx]))
  );
}
