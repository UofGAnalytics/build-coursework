import {
  ignoreWhitespace,
  testProcessor,
} from '../../test-utils/test-processor';

describe('tables', () => {
  it('should render a table correctly', async () => {
    const { html } = await testProcessor(`
      | Escape sequence | Meaning          | Example         |
      |------------|------------------|-----------------|
      | \\n      | Insert a new line | "Line 1\\nLine 2"     |
      | \`\'\`      | Single quote ("\`'\`") | \`'\'quoted\''\` |
      | \`\"\`      | Doubles quotes ("\`"\`") | \`"\"quoted\""\` |
      | \`\\\`      | Backslash ("\`\\\`") | \`"\\"\` |
      | \`\\xhh\`    | Character with hex value \`hh\` | \`"\x41"\` (letter "A") |
      | \`\Uhhhhhhhh\` | Unicode character with hex value \`hhhhhhhh\` | \`"\U0001f604"\` (a smiley)|
    `);

    expect(ignoreWhitespace(html)).toBe(
      ignoreWhitespace(`
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Escape sequence</th>
              <th>Meaning</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>\\n</td>
              <td>Insert a new line</td>
              <td>"Line 1\\nLine 2"</td>
            </tr>
            <tr>
              <td><code>'</code></td>
              <td>Single quote ("<code>'</code>")</td>
              <td><code>''quoted''</code></td>
            </tr>
            <tr>
              <td><code>"</code></td>
              <td>Doubles quotes ("<code>"</code>")</td>
              <td><code>""quoted""</code></td>
            </tr>
            <tr>
              <td><code>\\</code></td>
              <td>Backslash ("<code>\\</code>")</td>
              <td><code>"\\"</code></td>
            </tr>
            <tr>
              <td><code>\\xhh</code></td>
              <td>Character with hex value <code>hh</code></td>
              <td><code>"A"</code> (letter "A")</td>
            </tr>
            <tr>
              <td><code>Uhhhhhhhh</code></td>
              <td>Unicode character with hex value <code>hhhhhhhh</code></td>
              <td><code>"U0001f604"</code> (a smiley)</td>
            </tr>
          </tbody>
        </table>
      </div>
    `)
    );
  });
});
