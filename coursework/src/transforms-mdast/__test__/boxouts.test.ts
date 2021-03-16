import {
  createHtml,
  testProcessor,
} from '../../test-utils/test-processor';

describe('example', () => {
  it('should render an example boxout', async () => {
    const { html } = await testProcessor(`
      :::example
      An example of *this*!
      :::
    `);

    const expected = createHtml(`
      <div class="boxout example" id="example-1">
        <h3>Example 1</h3>
        <p>An example of <em>this</em>!</p>
      </div>
    `);

    expect(html).toBe(expected);
  });

  it('should render an example boxout with a title', async () => {
    const { html } = await testProcessor(`
      :::example[My Example]
      An example of *this*!
      :::
    `);

    const expected = createHtml(`
      <div class="boxout example" id="example-1">
        <h3>Example 1 (My Example)</h3>
        <p>An example of <em>this</em>!</p>
      </div>
    `);

    expect(html).toBe(expected);
  });

  it('should render an example boxout with an empty title', async () => {
    const { html } = await testProcessor(`
      :::example[]
      An example of *this*!
      :::
    `);

    const expected = createHtml(`
      <div class="boxout example" id="example-1">
        <h3>Example 1</h3>
        <p>An example of <em>this</em>!</p>
      </div>
    `);

    expect(html).toBe(expected);
  });

  it('should render an example boxout with an icon', async () => {
    const { html } = await testProcessor(`
      :::example{icon=hello}
      An example of *this*!
      :::
    `);

    const expected = createHtml(`
      <div class="boxout example hello-icon" id="example-1">
        <h3>Example 1</h3>
        <p>An example of <em>this</em>!</p>
      </div>
    `);

    expect(html).toBe(expected);
  });

  it('should render an example boxout with a title and icon', async () => {
    const { html } = await testProcessor(`
      :::example[My Example]{icon=hello}
      An example of *this*!
      :::
    `);

    const expected = createHtml(`
      <div class="boxout example hello-icon" id="example-1">
        <h3>Example 1 (My Example)</h3>
        <p>An example of <em>this</em>!</p>
      </div>
    `);

    expect(html).toBe(expected);
  });
});

describe('supplement', () => {
  it('should render a supplement boxout', async () => {
    const { html } = await testProcessor(`
      :::supplement
      A supplement of *this*!
      :::
    `);

    const expected = createHtml(`
      <div class="boxout supplement" id="supplement-1">
        <h3>Supplement 1</h3>
        <p>A supplement of <em>this</em>!</p>
      </div>
    `);

    expect(html).toBe(expected);
  });
});

describe('background', () => {
  it('should render a background boxout', async () => {
    const { html } = await testProcessor(`
      :::background
      A background of *this*!
      :::
    `);

    const expected = createHtml(`
      <div class="boxout background" id="background-1">
        <h3>Background 1</h3>
        <p>A background of <em>this</em>!</p>
      </div>
    `);

    expect(html).toBe(expected);
  });
});

describe('weblink', () => {
  it('should render a weblink boxout', async () => {
    const { html } = await testProcessor(`
      :::weblink
      A weblink of *this*!
      :::
    `);

    const expected = createHtml(`
      <div class="boxout weblink" id="weblink-1">
        <h3>Weblink 1</h3>
        <p>A weblink of <em>this</em>!</p>
      </div>
    `);

    expect(html).toBe(expected);
  });
});
