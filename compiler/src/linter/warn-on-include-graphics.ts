import { VFile } from 'vfile';

import { warnMessage } from '../utils/message';

export function warnOnIncludeGraphics(file: VFile) {
  const md = file.contents as string;
  md.split('\n').forEach((line, idx) => {
    if (line.includes('include_graphics')) {
      warnMessage(
        file,
        'Use markdown syntax instead of knitr::include_graphics to embed images: ![Alt text](image.png).  If knitr::include_graphics is necessary, use without out.width, out.height and fig.align knitr chunk properties.',
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
