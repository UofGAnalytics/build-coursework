import {
  ignoreWhitespace,
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

describe('escaping', () => {
  it('should display sample markdown headings', async () => {
    const { html } = await testProcessor(`
      \`\`\`
      ## This is a subsection
      \`\`\`
    `);

    const expected = unindentString(`
      <div class="code-wrapper">
        <pre><code>## This is a subsection</code></pre>
      </div>
    `);

    expect(html).toBe(expected);
  });

  it('should display sample rmarkdown syntax', async () => {
    // https://bookdown.org/yihui/rmarkdown-cookbook/verbatim-code-chunks.html
    // https://markdownmonster.west-wind.com/docs/_5eg1brc0z.htm
    const { html } = await testProcessor(`
      ~~~
      \`\`\`{r #chunk options go here}\`r ''\`
      #R code goes here
      \`\`\`
      ~~~
    `);

    const expected = ignoreWhitespace(`
      <div class="code-wrapper">
      <pre><code>\`\`\`{r #chunk options go here}
      # R code goes here
      \`\`\`</code></pre>
      </div>
    `);
    expect(ignoreWhitespace(html)).toBe(expected);
  });

  it('should display sample html comments', async () => {
    // https://www.jamestharpe.com/markdown-comments
    const { html } = await testProcessor(`
      \`\`\`
      <!---begin.rcode #chunk-options
      # R code goes here
      end.rcode-->
      \`\`\`
    `);

    const expected = ignoreWhitespace(`
      <div class="code-wrapper">
      <pre><code>&#x3C;!--begin.rcode #chunk-options
      # R code goes here
      end.rcode--></code></pre>
      </div>
    `);
    expect(ignoreWhitespace(html)).toBe(expected);
  });

  it('should escape sample latex', async () => {
    const { html } = await testProcessor(`
      ~~~
      <div class="mathjax-ignore">
      \`\`\`latex
      \\documentclass{article}
      \\usepackage{booktabs}

      <<echo=FALSE>>=
      # Paremeters need to be set manually when not using rmarkdown
      params <- list(sex="F", year=2015)
      @

      \\begin{document}
      \\SweaveOpts{concordance=TRUE}

      \\title{Baby names in the United States}
      \\maketitle

      <<echo=FALSE>>=
      library(babynames)
      library(tidyverse)
      # Get the 10 most popular names in the given year for the given gender
      top10 <- babynames %>%
                  filter(sex==params$sex, year==params$year) %>%
                  group_by(name) %>%
                  summarize(total = sum(n)) %>%
                  arrange(desc(total)) %>%
                  slice(1:10)
      if (params$sex=="M") {
        boysorgirls <- "boys"
      } else {
        boysorgirls <- "girls"
      }
      @

      \\section*{Top 10 baby names for \\Sexpr{boysorgirls} in \\Sexpr{params$year}}

      <<echo=FALSE, results=tex>>=
      library(knitr)
      top10 %>%
          kable(format="latex", booktabs=TRUE)
      @

      \\section*{History}

      <<echo=FALSE, fig=TRUE>>=
      # extract popularity of those names over the last 50 years
      chartdata <- babynames %>%
                      filter(year>params$year-50, year<=params$year,
                            sex==params$sex,
                            name %in% top10$name) %>%
                      group_by(name, year) %>%
                      summarize(total = sum(n))

      # Prevent ggplot from showing the names in alphabetical order
      chartdata <- chartdata %>%
                      ungroup() %>%
                      mutate(name=factor(name, levels=top10$name))

      # Generate time series plots
      ggplot(data=chartdata) +
            geom_line(aes(x=year, y=total)) +
            facet_wrap(~name)
      @

      \\end{document}
      \`\`\`
      </div>
      ~~~
    `);

    expect(html).toContain('\\begin{document}');
    expect(html).toContain('boysorgirls &#x3C;- "girls"');
    expect(html).toContain('\\end{document}');
  });

  it('should escape gfm autolinking', async () => {
    const { html } = await testProcessor(`
      Bla bla https://www.nhm.co.uk.

      Bla bla ht<span>tps://</span>w<span>ww.</span>nhm.co.uk.
    `);

    const expected = unindentString(`
      <p>Bla bla <a href="https://www.nhm.co.uk">https://www.nhm.co.uk</a>.</p>
      <p>Bla bla ht<span>tps://</span>w<span>ww.</span>nhm.co.uk.</p>
    `);

    expect(html).toBe(expected);
  });

  it('nested lists', async () => {
    const { html } = await testProcessor(`
      <style>
      ol ol {
        list-style-type: lower-alpha;
      }
      </style>
      1. one
         1. one-one
         2. one-two
         3. one-three
      2. two
      3. three

    `);

    const expected = unindentString(`
      <style>
      ol ol {
        list-style-type: lower-alpha;
      }
      </style>
      <ol>
        <li>one
          <ol>
            <li>one-one</li>
            <li>one-two</li>
            <li>one-three</li>
          </ol>
        </li>
        <li>two</li>
        <li>three</li>
      </ol>
    `);

    expect(html).toBe(expected);
  });
});
