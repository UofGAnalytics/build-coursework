import {
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

describe('example', () => {
  it('should render an example boxout', async () => {
    const { html } = await testProcessor(
      `
      \`\`\`textfile poem.txt
      Now We Are Six by A. A. Milne
      \`\`\`
    `,
      { noSyntaxHighlight: false },
    );

    const expected = unindentString(`
      <div class="text-file">
        <div class="text-file-wrapper">
          <div class="text-file-header"></div>
          <div class="text-file-content">Now We Are Six by A. A. Milne</div>
        </div>
      </div>
    `);

    expect(html).toBe(expected);
  });
});
