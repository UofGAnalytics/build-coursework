import { highlight } from 'highlight.js';

export function renderCodeBlock(language: string, code: string) {
  const highlighted = highlight(language, code).value;
  return `<pre><code class="${language}">${highlighted}</code></pre>\n`;
}
