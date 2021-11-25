import {
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

describe('example', () => {
  it('should allow the author to use sample markdown headings', async () => {
    const { html } = await testProcessor(`
      \`\`\`
      ## This is a subsection
      \`\`\`
    `);

    const expected = unindentString(`
      <div class="code-wrapper">
        <pre><code>## This is a subsection</code></pre>
      </div>
    `);

    expect(html).toBe(expected);
  });
});
