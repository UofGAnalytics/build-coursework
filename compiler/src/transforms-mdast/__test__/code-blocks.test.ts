import {
  createHtml,
  testProcessor,
} from '../../test-utils/test-processor';

describe('codeBlocks', () => {
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

    const withOutput = mdast.children.map((o, idx) => {
      const v = (o.value || '') as string;
      const value = v.slice(0, v.indexOf('\n'));
      return `${idx} ${value}`.trim();
    });

    const expected = createHtml(`
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
    const { hast } = await testProcessor(
      `
      \`\`\`{r}
      x <- rnorm(100)
      hist(x)
      \`\`\`
    `,
      { noEmbedAssets: false }
    );

    const children = hast.children as any[];
    const tagName = children[3].children[1].children[1].tagName;
    expect(tagName).toBe('svg');
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
});
