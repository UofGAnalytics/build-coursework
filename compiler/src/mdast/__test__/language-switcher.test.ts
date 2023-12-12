import {
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

describe('program switcher', () => {
  it('should show the program switcher correctly', async () => {
    const { html } = await testProcessor(`
      ::::language-switcher
      :::r
      I am R
      :::

      :::python
      I am Python
      :::
      ::::
    `);

    const expected = unindentString(`
      <div class="language-switcher">
        <ul>
          <li data-language="r">R</li>
          <li data-language="python">Python</li>
        </ul>
        <div data-language="r" class="language">
          <p>I am R</p>
        </div>
        <div data-language="python" class="language">
          <p>I am Python</p>
        </div>
      </div>
    `);

    expect(html).toBe(expected);
  });

  it('should only show cli', async () => {
    const md = `
      ::::language-switcher
      :::r
      I am R
      :::

      :::python
      I am Python
      :::
      ::::
    `;
    const { html } = await testProcessor(md, {
      envLanguage: 'r',
    });

    const expected = unindentString(`
      <div class="language-switcher">
        <div data-language="r" class="language show">
          <p>I am R</p>
        </div>
      </div>
    `);

    expect(html).toBe(expected);
  });
});
