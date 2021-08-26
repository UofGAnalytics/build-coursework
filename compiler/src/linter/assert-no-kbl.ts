import { VFile } from 'vfile';

import { warnMessage } from '../utils/message';

export function assertNoKbl(file: VFile) {
  const md = file.contents as string;
  md.split('\n').forEach((line, idx) => {
    if (line.includes('kbl()')) {
      warnMessage(
        file,
        'kbl() was found. Please note: table styles may not look the same in HTML output',
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
