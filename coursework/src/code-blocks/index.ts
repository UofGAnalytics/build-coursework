import { VFile } from 'vfile';
import { Node } from 'hast';
import unified from 'unified';
import { customCodeOutput } from './custom-code-output';

export async function codeBlocks(
  hast: Node,
  file: VFile,
  dirPath: string
) {
  const processor = unified().use(customCodeOutput, dirPath);

  return processor.run(hast, file);
}
