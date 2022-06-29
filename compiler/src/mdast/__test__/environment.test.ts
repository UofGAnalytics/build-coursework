import {
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

describe('environment', () => {
  it('should only show windows and cli sections', async () => {
    const { html } = await testProcessor(
      `
      :::environment
      :::

      :::mac
      I am mac
      :::

      :::windows
      I am windows
      :::

      :::linux
      I am linux
      :::

      :::cli
      I am cli
      :::

      :::github-desktop
      I am Github Desktop
      :::
    `,
      {
        envPlatform: 'windows',
        envProgram: 'cli',
      }
    );

    const expected = unindentString(`
      <div class="platform windows">
        <p>I am windows</p>
      </div>
      <div class="program cli">
        <p>I am cli</p>
      </div>
    `);

    expect(html).toBe(expected);
  });
});
