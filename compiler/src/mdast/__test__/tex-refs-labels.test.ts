import {
  ignoreWhitespace,
  testProcessor,
  unindentStringAndTrim,
} from '../../test-utils/test-processor';

describe('latexReferences', () => {
  it('should add references correctly', async () => {
    const id = 'eqn:chainrule';

    const { md } = await testProcessor(String.raw`
      \begin{align} a=b \label{${id}} \end{align}

      Some text (\ref{${id}})
    `);

    const expectedMd = unindentStringAndTrim(`
      :blockMath[0]

      Some text ([1](#${makeAnchor(id)}))
    `);

    expect(ignoreWhitespace(md)).toBe(ignoreWhitespace(expectedMd));
  });
});

function makeAnchor(id: string) {
  return encodeURIComponent(`mjx-eqn:${id}`);
}
