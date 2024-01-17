import {
  ignoreWhitespace,
  testProcessor,
} from '../../test-utils/test-processor';

describe('footnotes', () => {
  it('should render a footnote', async () => {
    const { html } = await testProcessor(`
      ## test

      hello
    `);

    const expected = ignoreWhitespace(`
      <h2 id="test">
        <a class="link" href="#test">
          <svg class="icon link-icon"><use href="#link-icon"></use></svg>
        </a>
        test
      </h2>
      <p>hello</p>
    `);

    expect(ignoreWhitespace(html)).toBe(expected);
  });
});
