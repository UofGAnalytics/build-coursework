import {
  ignoreWhitespace,
  testProcessor,
  unindentString,
  unindentStringAndTrim,
} from '../../test-utils/test-processor';

describe('latex', () => {
  it('should add references correctly', async () => {
    const id = 'eqn:chainrule';

    const { md } = await testProcessor(String.raw`
      \begin{align} a=b \label{${id}} \end{align}

      Some text (\ref{${id}})
    `);

    const expectedMd = unindentStringAndTrim(`
      :blockMath[0]

      Some text ([1](#${encodeURIComponent(`mjx-eqn:${id}`)}))
    `);

    expect(ignoreWhitespace(md)).toBe(ignoreWhitespace(expectedMd));
  });

  it('should error on referencing non-numbered section', async () => {
    const { md } = await testProcessor(String.raw`
      \label{def:scoreuniv}$U=\dfrac{dl(\theta;y)}{d\theta}$

      (multivariate version of the score from Definition \ref{def:scoreuniv})
    `);

    const expectedMd = unindentStringAndTrim(`
      :inlineMath[0]

      (multivariate version of the score from Definition [???](#))
    `);

    expect(ignoreWhitespace(md)).toBe(ignoreWhitespace(expectedMd));
  });

  it('should add error on tabular', async () => {
    const { hasFailingMessage } = await testProcessor(String.raw`
      \begin{center}
      \begin{tabular}{crrrrrrrrrr}
      \hline
      $y_i$ & 2 & 3 & 6 & 7 & 8 & 9 & 10& 12 & 15\\
      $x_i$ & -1 & -1 & 0 & 0 &0 & 0 & 1 & 1 & 1 \\
      \hline
      \end{tabular}
      \end{center}
    `);

    expect(
      hasFailingMessage(`LaTeX error: "Unknown environment 'center'".`)
    ).toBe(true);

    expect(
      hasFailingMessage(
        'LaTeX tables are not allowed, please use Markdown syntax'
      )
    ).toBe(true);
  });

  it('should remove unresolved label syntax', async () => {
    const { md } = await testProcessor(String.raw`
      \label{def:scoreuniv}$U=\dfrac{dl(\theta;y)}{d\theta}$
    `);

    const expected = unindentString(`
      :inlineMath[0]
    `);

    expect(md.trim()).toBe(expected.trim());
  });

  it('should work with square bracket syntax', async () => {
    const { md } = await testProcessor(String.raw`
      \[(\exp(-2.977),\exp(-2.245))=(0.051,0.106).\]
    `);

    const expected = unindentString(`
      :blockMath[0]
    `);

    expect(md.trim()).toBe(expected.trim());
  });
});
