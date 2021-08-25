import { Literal } from 'hast';

import {
  ignoreWhitespace,
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

describe('knitr', () => {
  it('should share state with other codeblocks', async () => {
    const { mdast } = await testProcessor(`
      \`\`\`{r}
      a <- c(1, 4, 2)
      a
      \`\`\`

      \`\`\`{r}
      names(a) <- c("first", "second", "third")
      a
      \`\`\`

      \`\`\`{r}
      a <- c(first=1, second=4, third=2)
      \`\`\`

      \`\`\`{r}
      a[3]
      \`\`\`

      \`\`\`{r}
      a[3] <- 10
      a
      \`\`\`

      \`\`\`{r}
      a[7] <- 99
      a
      \`\`\`

      \`\`\`{r}
      a["third"]
      \`\`\`
    `);

    const children = mdast.children as Literal[];
    const withOutput = children.map((o, idx) => {
      const v = (o.value || '') as string;
      const value = v.slice(0, v.indexOf('\n'));
      return `${idx} ${value}`.trim();
    });

    const expected = unindentString(`
      0 a <- c(1, 4, 2)
      1 ## [1] 1 4
      2 names(a) <- c("first", "second", "third")
      3 ##  first second  third
      4 a <- c(first=1, second=4, third=2
      5 a[3
      6 ## third
      7 a[3] <- 10
      8 ##  first second  third
      9 a[7] <- 99
      10 ##  first second  third
      11 a["third"
      12 ## third
    `);

    expect(withOutput.join('\n')).toBe(expected.trim());
  });

  it('should output a graph as svg', async () => {
    const { html } = await testProcessor(
      `
      \`\`\`{r}
      x <- rnorm(100)
      hist(x)
      \`\`\`
    `,
      { noEmbedAssets: false }
    );

    expect(html.includes('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(
      true
    );
  });

  it('should ignore tab whitespace', async () => {
    const { html } = await testProcessor(`
      \`\`\`{r, echo=TRUE}
      n <- 20
      loan <- 9000
      interest.rate <- 0.15
      v <- 1 / (1+interest.rate)
      payment <- loan * (1-v) / (v*(1-v^n))
      k<-10
      alpha10 <- v^(n+1-k)
      capital10 <- payment * alpha10

      interest10 <- payment * (1-alpha10)

      k <- 1:n                               # create vector with all possible k
      alpha <- v^(n+1-k)                     # split factors
      capital <- alpha * payment             # capital repayments
      interest <- (1-alpha) * payment        # interest part
      data <- data.frame(Year=1:20, rbind(data.frame(Type="Capital repayment",
            \t                                       Payment=capital),
                                          data.frame(Type="Interest",
                                                    Payment=interest)))
      library(ggplot2)
      ggplot(data=data) + geom_col(aes(Year, Payment, fill=Type))
      \`\`\`
    `);

    expect(html.includes('Error: unexpected end of input')).toBe(false);
  });

  it('should encapsulate r output', async () => {
    const { html } = await testProcessor(`
      \`\`\`{r}
      a <- c(1, 4, 2)
      a
      \`\`\`

      \`\`\`r
      b <- c(4, 2, 0)
      \`\`\`
    `);

    const expected = unindentString(`
      <div class="code-wrapper">
        <pre><code>a &#x3C;- c(1, 4, 2)
      a</code></pre>
      </div>
      <div class="code-wrapper r-output">
        <pre><code>## [1] 1 4 2</code></pre>
      </div>
      <div class="code-wrapper">
        <pre><code>b &#x3C;- c(4, 2, 0)</code></pre>
      </div>
    `);

    expect(ignoreWhitespace(html)).toBe(ignoreWhitespace(expected));
  });

  it('should format table correctly', async () => {
    const { md } = await testProcessor(`
      \`\`\`{r, results = 'hide'}
      beetles <- read.csv(url("http://www.stats.gla.ac.uk/~tereza/rp/beetles.csv"))
      beetles
      \`\`\`
      \`\`\`{r, echo = FALSE}
      knitr::kable(beetles)
      \`\`\`
      Since we have grouped data (multiple beetles per dose), we can visualise the probability of the outcome of interest (beetles killed) by plotting the proportion killed for each dose against the dose. We see that the proportion killed increases with increasing dose.
    `);

    const expected = unindentString(`
      \`\`\`r
      beetles <- read.csv(url("http://www.stats.gla.ac.uk/~tereza/rp/beetles.csv"))
      beetles
      \`\`\`

      |   dose| number| killed|
      |------:|------:|------:|
      | 1.6907|     59|      6|
      | 1.7242|     60|     13|
      | 1.7552|     62|     18|
      | 1.7842|     56|     28|
      | 1.8113|     63|     52|
      | 1.8369|     59|     53|
      | 1.8610|     62|     61|
      | 1.8839|     60|     60|

      Since we have grouped data (multiple beetles per dose), we can visualise the probability of the outcome of interest (beetles killed) by plotting the proportion killed for each dose against the dose. We see that the proportion killed increases with increasing dose.
    `);
    expect(md.trim()).toBe(expected.trim());
  });

  it('should display knitr output correctly', async () => {
    const { md } = await testProcessor(`
      \`\`\`{r}
      beetles$propkilled <- beetles$killed / beetles$number
      \`\`\`
    `);
    expect(md).toContain(
      'beetles$propkilled <- beetles$killed / beetles$number'
    );
  });
});
