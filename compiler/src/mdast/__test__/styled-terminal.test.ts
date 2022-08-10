import {
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

describe('styled-terminal', () => {
  it('should render a terminal element', async () => {
    const { html } = await testProcessor(`
      \`\`\`{bash}
      cd ~/Desktop
      ls
      \`\`\`
    `);

    const expected = unindentString(`
      <div class="terminal">
        <pre><code>cd ~/Desktop
      ls</code></pre>
        <pre><code>3x3+Customs+Universal+6-in-1+Router+Jig+Instructions+(1).pdf
      backup.pages
      basement stairs
      messages.mbox
      motivating-example.txt
      pat.txt
      progress.pages
      solar panels
      solomusic.pdf
      solomusic_rs232.pdf
      todo.pages
      todo.rtf</code></pre>
      </div>
    `);

    expect(html).toBe(expected);
  });
});
