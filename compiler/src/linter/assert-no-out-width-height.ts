import { VFile } from 'vfile';

import { failMessage } from '../utils/message';

export function assertNoOutWidthHeight(md: string, file: VFile) {
  md.split('\n').forEach((line, idx) => {
    if (/{.*?out.width/.test(line) || /{.*?out.height/.test(line)) {
      failMessage(
        file,
        'knitr properties out.width and out.height are not supported',
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
