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
      <p>Bla bla <sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref="" aria-describedby="footnote-label">1</a></sup>.</p>
      <section data-footnotes="" class="footnotes">
        <h2 id="footnote-label" class="sr-only">Footnotes</h2>
        <ol>
          <li id="user-content-fn-1">
            <p>Bla <a href="#user-content-fnref-1" data-footnote-backref="" class="data-footnote-backref" aria-label="Back to content">↩</a></p>
          </li>
        </ol>
      </section>
    `);

    expect(html).toBe(expected);
  });

  it('should render an inline footnote', async () => {
    const { html } = await testProcessor(`
      Bla bla ^[Bla].
    `);

    const expected = unindentString(`
      <p>Bla bla <sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref="" aria-describedby="footnote-label">1</a></sup>.</p>
      <section data-footnotes="" class="footnotes">
        <h2 id="footnote-label" class="sr-only">Footnotes</h2>
        <ol>
          <li id="user-content-fn-1">
            <p>Bla <a href="#user-content-fnref-1" data-footnote-backref="" class="data-footnote-backref" aria-label="Back to content">↩</a></p>
          </li>
        </ol>
      </section>
    `);

    expect(html).toBe(expected);
  });
});
