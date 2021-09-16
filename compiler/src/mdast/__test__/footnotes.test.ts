import {
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

describe('footnotes', () => {
  it('should render a footnote', async () => {
    const { html } = await testProcessor(`
      Bla bla [^1].
      [^1]: Bla
    `);

    const expected = unindentString(`
      <p>Bla bla <sup id="fnref-1"><a href="#fn-1" class="footnote-ref">1</a></sup>.</p>
      <div class="footnotes">
        <hr>
        <ol>
          <li id="fn-1">Bla<a href="#fnref-1" class="footnote-backref">↩</a></li>
        </ol>
      </div>
    `);

    expect(html).toBe(expected);
  });

  it('should render an inline footnote', async () => {
    const { html } = await testProcessor(`
      Bla bla ^[Bla].
    `);

    const expected = unindentString(`
      <p>Bla bla <sup id="fnref-1"><a href="#fn-1" class="footnote-ref">1</a></sup>.</p>
      <div class="footnotes">
        <hr>
        <ol>
          <li id="fn-1">Bla<a href="#fnref-1" class="footnote-backref">↩</a></li>
        </ol>
      </div>
    `);

    expect(html).toBe(expected);
  });
});
