import { Element, Literal } from 'hast';

import {
  ignoreWhitespace,
  normalizeLineEndings,
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';
import { EOL } from 'os';

describe('knitr', () => {
  it('should share state with other codeblocks', async () => {
    const { hast } = await testProcessor(`
      \`\`\`{r echo=FALSE}
      a <- c(1, 4, 2)
      a
      \`\`\`

      \`\`\`{r echo=FALSE}
      names(a) <- c("first", "second", "third")
      a
      \`\`\`

      \`\`\`{r echo=FALSE}
      a <- c(first=1, second=4, third=2)
      \`\`\`

      \`\`\`{r echo=FALSE}
      a[3]
      \`\`\`

      \`\`\`{r echo=FALSE}
      a[3] <- 10
      a
      \`\`\`

      \`\`\`{r echo=FALSE}
      a[7] <- 99
      a
      \`\`\`

      \`\`\`{r echo=FALSE}
      a["third"]
      \`\`\`
    `);

    const children = hast.children as Element[];
    const withOutput = children
      .filter((child: Element) => {
        const className = child.properties?.className;
        const arr = Array.isArray(className) ? className : [className];
        return child.tagName === 'div' && arr.includes('code-wrapper');
      })
      .map((codeWrapper) => {
        const pre = codeWrapper.children[1] as Element;
        const code = pre.children[0] as Element;
        const { value } = code.children[0] as Literal;
        return value
          .split(EOL)
          .map((s) => s.trim())
          .join(EOL);
      });

    const expected = unindentString(`
      [1] 1 4 2
      first second  third
      1      4      2
      third
      2
      first second  third
      1      4     10
      first second  third
      1      4     10     NA     NA     NA     99
      third
      10
    `);

    expect(normalizeLineEndings(withOutput.join(EOL))).toBe(
      normalizeLineEndings(expected.trim()),
    );
  });

  it('should output a graph as svg', async () => {
    const { html } = await testProcessor(
      `
      \`\`\`{r}
      x <- rnorm(100)
      hist(x)
      \`\`\`
    `,
      { noEmbedAssets: false },
    );
    expect(html).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  it('should output a graph as png', async () => {
    const { html } = await testProcessor(
      `
      \`\`\`{r, dev='png'}
      x <- rnorm(100)
      hist(x)
      \`\`\`
    `,
      { noEmbedAssets: false },
    );

    expect(html).toContain('<img src="data:image/png;base64');

    // testing fig.retina=2 in knitr.R
    expect(html).toContain('style="max-width: 1008px"');
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
    const { md, html } = await testProcessor(`
      \`\`\`{r}
      a <- c(1, 4, 2)
      a
      \`\`\`

      \`\`\`r
      b <- c(4, 2, 0)
      \`\`\`
    `);

    const expectedMd = unindentString(`
      ::codeBlock[0]

      ::codeBlock[1]

      ::codeBlock[2]
    `);

    expect(normalizeLineEndings(md.trim())).toBe(
      normalizeLineEndings(expectedMd.trim()),
    );

    const expectedHtml = unindentString(`
      <div class="code-wrapper">
        <pre><code>a &#x3C;- c(1, 4, 2)
      a</code></pre>
      </div>
      <div class="code-wrapper knitr-output">
        <pre><code>[1] 1 4 2</code></pre>
      </div>
      <div class="code-wrapper">
        <pre><code>b &#x3C;- c(4, 2, 0)</code></pre>
      </div>
    `);

    expect(normalizeLineEndings(html.trim())).toBe(
      normalizeLineEndings(expectedHtml.trim()),
    );
  });

  it('should format table correctly', async () => {
    const { html } = await testProcessor(`
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
      <div class="code-wrapper">
        <pre><code>beetles &#x3C;- read.csv(url("http://www.stats.gla.ac.uk/~tereza/rp/beetles.csv"))
      beetles</code></pre>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th align="right">dose</th>
              <th align="right">number</th>
              <th align="right">killed</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td align="right">1.6907</td>
              <td align="right">59</td>
              <td align="right">6</td>
            </tr>
            <tr>
              <td align="right">1.7242</td>
              <td align="right">60</td>
              <td align="right">13</td>
            </tr>
            <tr>
              <td align="right">1.7552</td>
              <td align="right">62</td>
              <td align="right">18</td>
            </tr>
            <tr>
              <td align="right">1.7842</td>
              <td align="right">56</td>
              <td align="right">28</td>
            </tr>
            <tr>
              <td align="right">1.8113</td>
              <td align="right">63</td>
              <td align="right">52</td>
            </tr>
            <tr>
              <td align="right">1.8369</td>
              <td align="right">59</td>
              <td align="right">53</td>
            </tr>
            <tr>
              <td align="right">1.8610</td>
              <td align="right">62</td>
              <td align="right">61</td>
            </tr>
            <tr>
              <td align="right">1.8839</td>
              <td align="right">60</td>
              <td align="right">60</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>Since we have grouped data (multiple beetles per dose), we can visualise the probability of the outcome of interest (beetles killed) by plotting the proportion killed for each dose against the dose. We see that the proportion killed increases with increasing dose.</p>
    `);

    expect(ignoreWhitespace(html)).toBe(ignoreWhitespace(expected));
  });

  it('should display r code correctly', async () => {
    const { html } = await testProcessor(
      `
      \`\`\`r
      beetles$propkilled <- beetles$killed / beetles$number
      \`\`\`
    `,
      { noSyntaxHighlight: false },
    );

    expect(ignoreWhitespace(html)).toContain(
      ignoreWhitespace(`
      <div class="code-wrapper">
        <pre>
          <code>
            beetles
            <span class="token operator">$</span>
            propkilled
            <span class="token operator">&#x3C;-</span>
            beetles
            <span class="token operator">$</span>
            killed
            <span class="token operator">/</span>
            beetles
            <span class="token operator">$</span>
            number
          </code>
        </pre>
      </div>
    `),
    );
  });

  it('should output R errors correctly', async () => {
    const { html, hasWarningMessage } = await testProcessor(`
      \`\`\`{r}
      "120" + "5"
      \`\`\`
    `);

    expect(ignoreWhitespace(html)).toContain(
      ignoreWhitespace(`
      <div class="code-wrapper error-output">
        <pre><code>Error in "120" + "5": non-numeric argument to binary operator</code></pre>
      </div>
    `),
    );

    expect(
      hasWarningMessage(
        'Error in "120" + "5": non-numeric argument to binary operator',
      ),
    ).toBe(true);
  });

  it.skip('should remove python warnings from the top of knitr output', async () => {
    const { md, messages } = await testProcessor(`
      WARNING - All triples will be processed in the same batch (batches_count=1).
      When processing large graphs it is recommended to batch the input knowledge
      graph instead.

      ## Introduction

      In the first two week of this course we have focused on the use of networks
      to analyse social systems, using a mixture of global statistics, node
      statistics, and ERGM modelling.
    `);

    expect(md.trim().startsWith('WARNING')).toBe(false);

    expect(messages[0].startsWith('All triples will be processed')).toBe(
      true,
    );
  });

  it('should error on bad bash code chunk', async () => {
    const { hasFailingMessage } = await testProcessor(
      `
      \`\`\`{bash}
      cat does-not-exist.txt
      \`\`\`
    `,
      { shouldFail: true },
    );

    expect(hasFailingMessage(`cat does-not-exist.txt`)).toBe(true);
  });

  it('should error on bad git code chunk', async () => {
    const { hasFailingMessage } = await testProcessor(
      `
      \`\`\`{bash}
      git add does-not-exist.txt
      \`\`\`
    `,
      { shouldFail: true },
    );

    expect(hasFailingMessage(`git add does-not-exist.txt`)).toBe(true);
  });

  it('should display r code correctly', async () => {
    const { html } = await testProcessor(
      `
      \`\`\`r
      beetles$propkilled <- beetles$killed / beetles$number
      \`\`\`
    `,
      { noSyntaxHighlight: false },
    );
    expect(ignoreWhitespace(html)).toContain(
      ignoreWhitespace(`
      <div class="code-wrapper">
        <pre>
          <code>
            beetles
            <span class="token operator">$</span>
            propkilled
            <span class="token operator">&#x3C;-</span>
            beetles
            <span class="token operator">$</span>
            killed
            <span class="token operator">/</span>
            beetles
            <span class="token operator">$</span>
            number
          </code>
        </pre>
      </div>
    `),
    );
  });

  it('should output R errors correctly', async () => {
    const { html, hasWarningMessage } = await testProcessor(`
      \`\`\`{r}
      "120" + "5"
      \`\`\`
    `);

    expect(ignoreWhitespace(html)).toContain(
      ignoreWhitespace(`
        <div class="code-wrapper">
          <pre><code>"120" + "5"</code></pre>
        </div>
        <div class="code-wrapper error-output">
          <pre><code>Error in "120" + "5": non-numeric argument to binary operator</code></pre>
        </div>
      `),
    );

    expect(
      hasWarningMessage(
        'Error in "120" + "5": non-numeric argument to binary operator',
      ),
    ).toBe(true);
  });

  it('should handle new knitr plot formatting', async () => {
    const { html } = await testProcessor(`
      <div class="figure">
      <img src="C:\\Users\\davie\\unnamed-chunk.svg" alt="plot of chunk unnamed" width="504" />
      <p class="caption">plot of chunk unnamed-chunk-3</p>
      </div>
    `);

    expect(ignoreWhitespace(html)).toBe(
      ignoreWhitespace(`
        <figure class="img-wrapper" id="plot-of-chunk-unnamed">
          <div class="img-bg">
            <img src="C:\\Users\\davie\\unnamed-chunk.svg" alt="plot of chunk unnamed">
          </div>
          <figcaption><a href="#plot-of-chunk-unnamed"><span class="caption-count">Figure 1:</span> plot of chunk unnamed</a></figcaption>
        </figure>
      `),
    );
  });

  it('should NOT use <sup>*</sup> in variable output', async () => {
    const { html } = await testProcessor(`
      \`\`\`{r}
      tml1 <- 2.999779e-10
      tml2 <- 1
      tml3 <- 1.472602e-29
      \`\`\`

      We find that the marginal likelihood for Model 1 was estimated as \`r tml1\`, the marginal
      likelihood for Model 2 as \`r tml2\`, and the marginal likelihood for Model 3 as \`r tml3\`.
      Using these estimates of the marginal likelihoods, we obtain the following posterior probabilities
      for our models:
    `);

    expect(ignoreWhitespace(html)).toContain(
      ignoreWhitespace(`
        We find that the marginal likelihood for Model 1 was estimated as 2.999779 × 10^{-10}, the marginal
        likelihood for Model 2 as 1, and the marginal likelihood for Model 3 as 1.472602 × 10^{-29}.
        Using these estimates of the marginal likelihoods, we obtain the following posterior probabilities
        for our models:
      `),
    );
  });
});
