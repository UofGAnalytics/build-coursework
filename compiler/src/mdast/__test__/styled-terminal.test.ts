import {
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

describe('styled-terminal', () => {
  it('should render a terminal element', async () => {
    const { html } = await testProcessor(`
      \`\`\`{bash}
      echo "hello!"
      \`\`\`
    `);

    const expected = unindentString(`
      <div class="terminal">
        <pre><code>echo "hello!"</code></pre>
        <pre><code>hello!</code></pre>
      </div>
    `);

    expect(html).toBe(expected);
  });
});
