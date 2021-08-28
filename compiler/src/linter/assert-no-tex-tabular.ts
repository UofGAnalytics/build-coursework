import { VFile } from 'vfile';

import { failMessage } from '../utils/message';

// TODO: could possibly try converting to array here
// https://stackoverflow.com/questions/51803244

export function assertNoTexTabular(file: VFile) {
  const md = file.contents as string;
  md.split('\n').forEach((line, idx) => {
    if (line.includes('\\begin{tabular}')) {
      failMessage(
        file,
        'LaTeX tables are not allowed, please use Markdown syntax',
        {
          start: {
            line: idx + 1,
            column: 0,
          },
          end: {
            line: idx + 1,
            column: line.length,
          },
        }
      );
    }
  });
}
