import {
  normalizeLineEndings,
  testProcessor,
  unindentStringAndTrim,
} from '../../test-utils/test-processor';

// sometimes this works instead ¯\_(ツ)_/¯
// Sys.setenv(RETICULATE_PYTHON = "/usr/bin/python3")
// reticulate::use_python("/opt/homebrew/bin/python3")

describe('python', () => {
  it('should run embedded python', async () => {
    const { html } = await testProcessor(`
      \`\`\`{python}
      print(2*2)
      \`\`\`

      \`\`\`{python}
      print(3*3)
      \`\`\`

      \`\`\`{python}
      print(4*4)
      \`\`\`
    `);

    expect(html).toContain(
      unindentStringAndTrim(`
        <div class="code-wrapper">
          <pre><code>print(2*2)</code></pre>
        </div>
        <div class="code-wrapper knitr-output">
          <pre><code>4</code></pre>
        </div>
        <div class="code-wrapper">
          <pre><code>print(3*3)</code></pre>
        </div>
        <div class="code-wrapper knitr-output">
          <pre><code>9</code></pre>
        </div>
        <div class="code-wrapper">
          <pre><code>print(4*4)</code></pre>
        </div>
        <div class="code-wrapper knitr-output">
          <pre><code>16</code></pre>
        </div>
      `),
    );
  }, 60000);

  it('should render a python table', async () => {
    const { html } = await testProcessor(`
      \`\`\`{python}
      import pandas as pd
      data = {
        "calories": [420, 380, 390],
        "duration": [50, 40, 45]
      }
      df = pd.DataFrame(data)
      df
      \`\`\`
    `);

    expect(normalizeLineEndings(html)).toContain(
      normalizeLineEndings(
        unindentStringAndTrim(`
            calories  duration
        0       420        50
        1       380        40
        2       390        45
      `),
      ),
    );
  }, 60000);
});
