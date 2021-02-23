import { VFile } from 'vfile';
import { Node } from 'hast';
import unified from 'unified';
import { customMathOutput } from './custom-math-output';

export async function latex(hast: Node, file: VFile) {
  const processor = unified().use(customMathOutput);

  return processor.run(hast, file);
}
