import {
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

describe('program switcher', () => {
  it('should show the program switcher correctly', async () => {
    const { html } = await testProcessor(`
      ::::program-switcher
      :::command-line
      I am cli
      :::

      :::github-desktop
      I am github desktop
      :::
      ::::
    `);

    const expected = unindentString(`
      <div class="program-switcher">
        <ul>
          <li data-program="command-line">Command-line</li>
          <li data-program="github-desktop">GitHub Desktop</li>
        </ul>
        <div data-program="command-line" class="program">
          <p>I am cli</p>
        </div>
        <div data-program="github-desktop" class="program">
          <p>I am github desktop</p>
        </div>
      </div>
    `);

    expect(html).toBe(expected);
  });

  it('should only show cli', async () => {
    const md = `
      ::::program-switcher
      :::command-line
      I am cli
      :::

      :::github-desktop
      I am github desktop
      :::
      ::::
    `;
    const { html } = await testProcessor(md, {
      envProgram: 'command-line',
    });

    const expected = unindentString(`
      <div class="program-switcher">
        <div data-program="command-line" class="program show">
          <p>I am cli</p>
        </div>
      </div>
    `);

    expect(html).toBe(expected);
  });
});
