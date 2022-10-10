import {
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

describe('program switcher', () => {
  it('should only show cli', async () => {
    const { html } = await testProcessor(
      `
      ::::program-switcher

      :::command-line
      I am cli
      :::

      :::github-desktop
      I am github desktop
      :::

      ::::
    `,
      {
        envProgram: 'command-line',
      }
    );

    console.log(html);

    const expected = unindentString(`
      <div class="program-switcher">
        <ul>
          <li data-program="command-line" class="active">Command-line</li>
          <li data-program="github-desktop">GitHub Desktop</li>
        </ul>
        <div data-program="command-line" class="program show">
          <p>I am cli</p>
        </div>
      </div>
    `);

    expect(html).toBe(expected);
  });
});
