import { VFile } from 'vfile';

import { warnMessage } from '../utils/message';

export function warnOnIncludeGraphics(file: VFile) {
  const md = file.value as string;
  md.split('\n').forEach((line, idx) => {
    if (line.includes('include_graphics')) {
      warnMessage(
        file,
        'knitr::include_graphics found. You should probably just use Markdown syntax instead.',
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
