import {
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

describe('language switcher', () => {
  it('should show the language switcher correctly', async () => {
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

  it('should only show r', async () => {
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

  it('should work inside boxouts', async () => {
    const md = `
      :::::example
      ### Example title
      ::::language-switcher
      :::r
      I am R
      :::

      :::python
      I am Python
      :::
      ::::
      :::::
    `;
    const { html } = await testProcessor(md);

    const expected = unindentString(`
      <div class="boxout example" id="example-1"><span class="type">Example 1</span>
        <h3 id="example-title"><a class="link" href="#example-title"><svg class="icon link-icon">
              <use href="#link-icon"></use>
            </svg></a>Example title</h3>
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
      </div>
    `);

    expect(html).toBe(expected);
  });
});
