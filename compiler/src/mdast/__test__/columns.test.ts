import {
  ignoreWhitespace,
  testProcessor,
} from '../../test-utils/test-processor';

describe('columns', () => {
  it('should render columns from macro', async () => {
    const { md } = await testProcessor(`
      ##[columns]
      ###[column]
      Column 1
      ###[/column]
      ###[column]
      Column 2
      ###[/column]
      ##[/columns]
    `);

    expect(ignoreWhitespace(md)).toBe(
      ignoreWhitespace(`
        ::::columns
        :::column
        Column 1
        :::
        :::column
        Column 2
        :::
        ::::
      `)
    );
  });

  it('should fail on columns with no column', async () => {
    const { hasFailingMessage } = await testProcessor(
      `
      ::::columns
      ::::
    `,
      { shouldFail: true }
    );
    expect(
      hasFailingMessage('Columns must contain at least 2 columns')
    ).toBe(true);
  });

  it('should fail on columns with one column', async () => {
    const { hasFailingMessage } = await testProcessor(
      `
      ::::columns
      :::column
      Column 1
      :::
      ::::
    `,
      { shouldFail: true }
    );
    expect(
      hasFailingMessage('Columns must contain at least 2 columns')
    ).toBe(true);
  });

  it('should fail on columns with one column', async () => {
    const { hasFailingMessage } = await testProcessor(
      `
      :::column
      Column 1
      :::
    `,
      { shouldFail: true }
    );
    expect(hasFailingMessage('Column must be nested inside columns')).toBe(
      true
    );
  });

  it('should render columns', async () => {
    const { html } = await testProcessor(`
      ::::columns
      :::column
      Column 1
      :::
      :::column
      Column 2
      :::
      ::::
    `);

    expect(ignoreWhitespace(html)).toBe(
      ignoreWhitespace(`
        <div class="columns">
          <div class="column">
            <p>Column 1</p>
          </div>
          <div class="column">
            <p>Column 2</p>
          </div>
        </div>
      `)
    );
  });

  it('should render columns with image', async () => {
    const { html } = await testProcessor(`
      ##[columns]
      ###[column, imgsrc="LMpr.pdf"]
      ###[/column]
      ###[column, imgsrc="LMpo.pdf"]
      ###[/column]
      ##[/columns]
    `);

    expect(ignoreWhitespace(html)).toBe(
      ignoreWhitespace(`
        <div class="columns">
          <div class="column">
            <figure class="img-wrapper" id="figure-1">
              <div class="img-bg">
                <img src="LMpr.pdf" alt="">
              </div>
              <figcaption><a href="#figure-1"><span class="caption-count">Figure 1</span></a></figcaption>
            </figure>
          </div>
          <div class="column">
            <figure class="img-wrapper" id="figure-2">
              <div class="img-bg">
                <img src="LMpo.pdf" alt="">
              </div>
              <figcaption><a href="#figure-2"><span class="caption-count">Figure 2</span></a></figcaption>
            </figure>
          </div>
        </div>
      `)
    );
  });

  it('should render columns with image and alt text', async () => {
    const { html } = await testProcessor(`
      ##[columns]
      ###[column, imgsrc="LMpr.pdf"]
      Alt text 1
      ###[/column]
      ###[column, imgsrc="LMpo.pdf"]
      Alt text 2
      ###[/column]
      ##[/columns]
    `);

    expect(ignoreWhitespace(html)).toBe(
      ignoreWhitespace(`
        <div class="columns">
          <div class="column">
            <figure class="img-wrapper" id="alt-text-1">
              <div class="img-bg">
                <img src="LMpr.pdf" alt="Alt text 1">
              </div>
              <figcaption><a href="#alt-text-1"><span class="caption-count">Figure 1:</span> Alt text 1</a></figcaption>
            </figure>
          </div>
          <div class="column">
            <figure class="img-wrapper" id="alt-text-2">
              <div class="img-bg">
                <img src="LMpo.pdf" alt="Alt text 2">
              </div>
              <figcaption><a href="#alt-text-2"><span class="caption-count">Figure 2:</span> Alt text 2</a></figcaption>
            </figure>
          </div>
        </div>
      `)
    );
  });

  it('should render columns with image and alt text and other text', async () => {
    const { html } = await testProcessor(`
      ##[columns]
      ###[column, imgsrc="LMpr.pdf"]
      Alt text 1

      More text 1
      ###[/column]
      ###[column, imgsrc="LMpo.pdf"]
      Alt text 2

      More text 2
      ###[/column]
      ##[/columns]
    `);

    expect(ignoreWhitespace(html)).toBe(
      ignoreWhitespace(`
        <div class="columns">
          <div class="column">
            <figure class="img-wrapper" id="alt-text-1">
              <div class="img-bg">
                <img src="LMpr.pdf" alt="Alt text 1">
              </div>
              <figcaption><a href="#alt-text-1"><span class="caption-count">Figure 1:</span> Alt text 1</a></figcaption>
            </figure>
            <p>More text 1</p>
          </div>
          <div class="column">
            <figure class="img-wrapper" id="alt-text-2">
              <div class="img-bg">
                <img src="LMpo.pdf" alt="Alt text 2">
              </div>
              <figcaption><a href="#alt-text-2"><span class="caption-count">Figure 2:</span> Alt text 2</a></figcaption>
            </figure>
            <p>More text 2</p>
          </div>
        </div>
      `)
    );
  });
});
