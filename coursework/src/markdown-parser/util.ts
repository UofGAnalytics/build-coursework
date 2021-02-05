import { highlight } from 'highlight.js';

export function renderCodeBlock(language: string, code: string) {
  const highlighted = highlight(language, code).value;
  return `
    <div class="code-wrapper">
      <pre><code class="${language}">${highlighted}</code></pre>
    </div>
  `;
}

export function renderCodeBlockWithOutput(
  language: string,
  code: string,
  output: string
) {
  const highlighted = highlight(language, code).value;
  return `
    <div class="code-wrapper">
      <pre><code class="${language}">${highlighted}</code></pre>
      <div class="out">
        <h3>Output</h3>
        ${output}
      </div>
    </div>
  `;
}
