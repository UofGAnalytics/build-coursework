import { Parent } from 'unist';

import { testProcessor } from '../../test-utils/test-processor';

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

    expect(getOutputAtIdx(mdast, 0)?.value).toBe('[1] 1 4 2\n');
    expect(getOutputAtIdx(mdast, 1)?.value).toBe(
      ' first second  third \n     1      4      2 \n'
    );
    expect(getOutputAtIdx(mdast, 2)).toBe(null);
    expect(getOutputAtIdx(mdast, 3)?.value).toBe('third \n    2 \n');
    expect(getOutputAtIdx(mdast, 4)?.value).toBe(
      ' first second  third \n     1      4     10 \n'
    );
    expect(getOutputAtIdx(mdast, 5)?.value).toBe(
      ' first second  third                             \n     1      4     10     NA     NA     NA     99 \n'
    );
    expect(getOutputAtIdx(mdast, 6)?.value).toBe('third \n   10 \n');
  });

  it('should not show output if none is given', async () => {
    const { mdast } = await testProcessor(`
      \`\`\`{r}
      a <- c(first=1, second=4, third=2)
      \`\`\`
    `);

    expect(getOutputAtIdx(mdast, 0)).toBe(null);
  });

  it('should output a graph as svg', async () => {
    const { mdast } = await testProcessor(`
      \`\`\`{r}
      x <- rnorm(100)
      hist(x)
      \`\`\`
    `);

    const node = getOutputAtIdx(mdast, 0) as Parent;
    expect(node.children.length > 2).toBe(true);
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

function getOutputAtIdx(mdast: Parent, idx: number) {
  const children = (mdast.children[idx]?.data?.hChildren ||
    []) as Parent[];

  const outer1 = children[1];
  if (!outer1) return null;

  const outer2 = outer1.children[1] as Parent;
  if (!outer2) return null;

  return outer2.children[0] || null;
}
