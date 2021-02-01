import { highlight } from 'highlight.js';
import { parseCodeParams } from './parse-code-params';

export function codeBlock(code: string, params: string | undefined) {
  const { language, options } = parseCodeParams(params);

  const highlighted = highlight(language, code).value;

  let result = `<pre><code class="${language}">${highlighted}</code></pre>\n`;

  if (language === 'r' && options.echo === true) {
    const executedRCode = 'result';
    result += `<div class="result">${executedRCode}</div>\n`;
  }

  return result;
}
