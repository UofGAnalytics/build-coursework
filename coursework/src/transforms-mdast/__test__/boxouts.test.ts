import {
  createHtml,
  testProcessor,
} from '../../test-utils/test-processor';

describe('boxouts', () => {
  it('should render an example boxout', async () => {
    const { html } = await testProcessor(`
      :::example[My Example]
      An example of *this*!
      :::
    `);

    const expected = createHtml(`
      <div class="boxout example">
        <h3>Example 1 (My Example)</h3>
        <p>An example of <em>this</em>!</p>
      </div>
    `);

    expect(html).toBe(expected);
  });

  it('should render a supplement boxout', async () => {
    const { html } = await testProcessor(`
      :::supplement
      An supplement of *this*!
      :::
    `);

    const expected = createHtml(`
      <div class="boxout supplement">
        <p>An supplement of <em>this</em>!</p>
      </div>
    `);

    expect(html).toBe(expected);
  });

  it('should render a background boxout', async () => {
    const { html } = await testProcessor(`
      :::background
      An background of *this*!
      :::
    `);

    const expected = createHtml(`
      <div class="boxout background">
        <p>An background of <em>this</em>!</p>
      </div>
    `);

    expect(html).toBe(expected);
  });

  it('should render a weblink boxout', async () => {
    const { html } = await testProcessor(`
      :::weblink
      An weblink of *this*!
      :::
    `);

    const expected = createHtml(`
      <div class="boxout weblink">
        <p>An weblink of <em>this</em>!</p>
      </div>
    `);

    expect(html).toBe(expected);
  });
});
