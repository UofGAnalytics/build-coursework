import {
  ignoreWhitespace,
  testProcessor,
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
      hasFailingMessage(
        'LaTeX tables are not allowed, please use Markdown syntax'
      )
    ).toBe(true);
  });
});
