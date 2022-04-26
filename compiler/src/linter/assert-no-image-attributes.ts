import { VFile } from 'vfile';

import { warnMessage } from '../utils/message';

export function assertNoImageAttributes(file: VFile) {
  const md = file.value as string;
  md.split('\n').forEach((line, idx) => {
    const match = line.match(/!\[.*\]\(.*\)({.+})/);
    if (match !== null) {
      warnMessage(
        file,
        `image attributes are not supported: ${match[1]}`,
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
