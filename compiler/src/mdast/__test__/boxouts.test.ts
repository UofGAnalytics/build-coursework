import {
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

describe('example', () => {
  it('should render an example boxout', async () => {
    const { html } = await testProcessor(`
      :::example
      An example of *this*!
      :::
    `);

    const expected = unindentString(`
      <div class="boxout example" id="example-1"><span class="type">Example</span>
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

    const expected = unindentString(`
      <div class="boxout example" id="example-1"><span class="type">Example</span>
        <h3>My Example</h3>
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

    const expected = unindentString(`
      <div class="boxout example" id="example-1"><span class="type">Example</span>
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

    const expected = unindentString(`
      <div class="boxout example hello-icon" id="example-1"><span class="type">Example</span>
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

    const expected = unindentString(`
      <div class="boxout example hello-icon" id="example-1"><span class="type">Example</span>
        <h3>My Example</h3>
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

    const expected = unindentString(`
      <div class="boxout supplement" id="supplement-1"><span class="type">Supplement</span>
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

    const expected = unindentString(`
      <div class="boxout background" id="background-1"><span class="type">Background</span>
        <p>A background of <em>this</em>!</p>
      </div>
    `);

    expect(html).toBe(expected);
  });
});

describe('weblink', () => {
  it.skip('should fail if no target', async () => {
    const { hasFailingMessage } = await testProcessor(
      `
    :::weblink
    A weblink of *this*!
    :::
    `,
      { shouldFail: true }
    );

    expect(hasFailingMessage('Weblink has no target attribute')).toBe(
      true
    );
  });

  it('should render a weblink boxout', async () => {
    const { html } = await testProcessor(`
      :::weblink{target=https://cran.r-project.org}
      A weblink of *this*!
      :::
    `);

    const expected = unindentString(`
      <div class="boxout weblink" id="weblink-1"><span class="type">Weblink</span>
        <h3><a href="https://cran.r-project.org" target="_blank" class="target">https://cran.r-project.org</a></h3>
        <p>A weblink of <em>this</em>!</p>
      </div>
    `);

    expect(html).toBe(expected);
  });

  it('should render a weblink boxout with title', async () => {
    const { html } = await testProcessor(`
      :::weblink[CRAN]{target=https://cran.r-project.org}
      A weblink of *this*!
      :::
    `);

    const expected = unindentString(`
      <div class="boxout weblink" id="weblink-1"><span class="type">Weblink</span>
        <h3><a href="https://cran.r-project.org" target="_blank" class="target">CRAN</a></h3>
        <p>A weblink of <em>this</em>!</p>
      </div>
    `);

    expect(html).toBe(expected);
  });
});
