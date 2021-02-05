import { parseCodeParams } from './parse-code-params';
import { renderCodeBlock } from './util';
import { renderRCodeBlock } from './r-code';

export function codeBlock(dirPath: string) {
  return function (code: string, opts: string | undefined) {
    const { language, options } = parseCodeParams(opts);

    switch (language) {
      case 'r':
        return renderRCodeBlock(dirPath, code, options);
    }

    return renderCodeBlock(language, code);
  };
}
