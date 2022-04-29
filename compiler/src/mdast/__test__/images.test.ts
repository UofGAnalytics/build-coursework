import {
  ignoreWhitespace,
  testProcessor,
} from '../../test-utils/test-processor';

describe('images', () => {
  it('should render an html figure', async () => {
    const { html } = await testProcessor('![]()');

    const expected = ignoreWhitespace(`
      <p></p>
      <figure class="img-wrapper" id="figure-1">
        <div class="img-bg">
          <img src="" alt="">
        </div>
        <figcaption>
          <a href="#figure-1">
            <span class="caption-count">Figure 1</span>
          </a>
        </figcaption>
      </figure>
      <p></p>
    `);

    expect(ignoreWhitespace(html)).toBe(expected);
  });

  it('should render an html figure with alt text', async () => {
    const { html } = await testProcessor('![My alt text]()');

    const expected = ignoreWhitespace(`
      <p></p>
      <figure class="img-wrapper" id="my-alt-text">
        <div class="img-bg">
          <img src="" alt="My alt text">
        </div>
        <figcaption>
          <a href="#my-alt-text">
            <span class="caption-count">Figure 1: </span>
            My alt text
          </a>
        </figcaption>
      </figure>
      <p></p>
    `);

    expect(ignoreWhitespace(html)).toBe(expected);
  });

  it('should render an html figure with custom attributes', async () => {
    const { hasWarningMessage } = await testProcessor(`
      ![My alt text](){width=50%}
    `);

    expect(
      hasWarningMessage('image attributes are not supported: {width=50%}')
    ).toBe(true);
  });
});
