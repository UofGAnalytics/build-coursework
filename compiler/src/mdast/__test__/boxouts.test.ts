// import chardet from 'chardet';

import { fixtureTestProcessor } from '../../test-utils/fixture-test-processor';
import {
  ignoreWhitespace,
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

// import iconv from 'iconv-lite';

describe('example', () => {
  it('should render an example boxout', async () => {
    const { html } = await testProcessor(`
      :::example
      An \`example\\n\` of *this*!
      :::
    `);

    const expected = unindentString(`
      <div class="boxout example" id="example-1"><span class="type">Example 1</span>
        <p>An <code>example\\n</code> of <em>this</em>!</p>
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
      <div class="boxout example" id="example-1"><span class="type">Example 1</span>
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
      <div class="boxout example" id="example-1"><span class="type">Example 1</span>
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
      <div class="boxout example hello-icon" id="example-1"><span class="type">Example 1</span>
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
      <div class="boxout example hello-icon" id="example-1"><span class="type">Example 1</span>
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
      <div class="boxout supplement" id="supplement-1"><span class="type">Supplement 1</span>
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
      <div class="boxout background" id="background-1"><span class="type">Background 1</span>
        <p>A background of <em>this</em>!</p>
      </div>
    `);

    expect(html).toBe(expected);
  });
});

describe('proposition', () => {
  it('should render a proposition boxout', async () => {
    const { html } = await testProcessor(`
      :::proposition
      A proposition of *this*!
      :::
    `);

    const expected = unindentString(`
      <div class="boxout proposition" id="proposition-1"><span class="type">Proposition 1</span>
        <p>A proposition of <em>this</em>!</p>
      </div>
    `);

    expect(html).toBe(expected);
  });
});

describe('optional task', () => {
  it('should render an optional tast boxout', async () => {
    const { html } = await testProcessor(`
      ###[task, optional]
      An optional task of *this*!
      ####[answer]
      Ho ho!
      ####[/answer]
      ###[/task]
    `);

    const expected = unindentString(`
      <div class="boxout task" id="task-1"><span class="type">Task 1 (Optional)</span>
        <p>An optional task of <em>this</em>!</p>
        <div class="answer"><span class="answer-trigger" data-answer-id="1">Show answer</span>
          <div class="answer-reveal" id="answer-1">
            <p>Ho ho!</p>
          </div>
        </div>
      </div>
    `);

    expect(html).toBe(expected);
  });
});

describe('weblink', () => {
  it('should render a weblink boxout', async () => {
    const { html } = await testProcessor(`
      :::weblink{target=https://cran.r-project.org}
      A weblink of *this*!
      :::
    `);

    const expected = unindentString(`
      <div class="boxout weblink" id="weblink-1"><span class="type">Weblink 1</span>
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
      <div class="boxout weblink" id="weblink-1"><span class="type">Weblink 1</span>
        <h3><a href="https://cran.r-project.org" target="_blank" class="target">CRAN</a></h3>
        <p>A weblink of <em>this</em>!</p>
      </div>
    `);

    expect(html).toBe(expected);
  });

  it('should render LaTeX in a title', async () => {
    const { html } = await testProcessor(`
      ###[theorem] Sampling/asymptotic distribution of $X^2$
      Bla bla
      ###[/theorem]
    `);

    const expected = '<h3>Sampling/asymptotic distribution of <svg';

    expect(ignoreWhitespace(html)).toContain(ignoreWhitespace(expected));
  });

  it('should render a ggplot inside', async () => {
    const { html } = await testProcessor(`
      ###[example] Air pollution in Glasgow

      The data file \`anderstonpm10.csv\` contains daily average air pollution concentrations in Glasgow Anderston for the last three months of 2007. The pollutant measured is called particulate matter, which comprises small particles of liquid and solids that are suspended in the air. We can read in the data and plot the time series as follows:

      \`\`\`{r echo=TRUE, fig.align='center', fig.width=5.5, fig.height=3}
      library(ggplot2)

      anderston <- read.csv(url("http://www.stats.gla.ac.uk/~tereza/rp/anderstonpm10.csv"))

      # Create a date variable for ggplot
      anderston$Date2 <- as.Date(anderston$Date, "%d/%m/%Y")

      ggplot(anderston, aes(Date2, Glasgow.Anderston)) + geom_line(color = "#41ab5d") +
          scale_x_date(date_labels = "%d-%b-%y", date_breaks = "2 week") +  xlab("Date") +
          ylab("Particulate matter") + ggtitle("Pollution concentrations in Glasgow")

      \`\`\`

      ###[/example]
    `);

    expect(html).toMatch(/<img src="(.+?)"/);
  });

  it('should increment counter across .Rmd files', async () => {
    const { html } = await fixtureTestProcessor('multifile-counter');
    expect(html.includes('id="task-2"')).toBe(true);
  });

  it('should display a £ sign', async () => {
    const { md } = await testProcessor(`\u00A3`);
    // const encoding = chardet.detect(Buffer.from(md));
    // const decoded = iconv.decode(Buffer.from(md), 'ISO-8859-1');
    // const encoded = iconv.encode(md, 'utf-8').toString();
    // console.log({ encoding });
    expect(md).toBe('£');
  });

  it('should display titles', async () => {
    const { md } = await testProcessor(`
      \`\`\`{r}
      a <- c(1, 4, 2)
      a
      \`\`\`

      ## A title
      A paragraph

      ### A subtitle
      A paragraph
    `);

    expect(ignoreWhitespace(md)).toBe(
      ignoreWhitespace(`
        \`\`\`r
        a <- c(1, 4, 2)
        a
        \`\`\`

        \`\`\`{.r-output}
        [1] 1 4 2
        \`\`\`

        ## A title
        A paragraph

        ### A subtitle
        A paragraph
      `)
    );
  });
});
