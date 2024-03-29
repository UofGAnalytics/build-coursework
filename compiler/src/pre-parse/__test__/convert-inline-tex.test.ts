import {
  ignoreWhitespace,
  testProcessor,
  unindentString,
  unindentStringAndTrim,
} from '../../test-utils/test-processor';

describe('convertTextBfToMd', () => {
  it('should reformat a \\textbf{} to markdown bold syntax', async () => {
    const { md } = await testProcessor(`
      Lorem \\textbf{hey} ipsum \\textbf{oh hai} dolor
    `);

    const expected = unindentStringAndTrim(`
      Lorem **hey** ipsum **oh hai** dolor
    `);

    expect(ignoreWhitespace(md)).toBe(ignoreWhitespace(expected));
  });

  it('should be idempotent', async () => {
    const { md } = await testProcessor(`
      Lorem \\textbf{hey} ipsum \\textbf{oh hai} dolor
    `);

    const { md: md2 } = await testProcessor(md);

    const expected = unindentStringAndTrim(`
      Lorem **hey** ipsum **oh hai** dolor
    `);

    expect(ignoreWhitespace(md2)).toBe(ignoreWhitespace(expected));
  });
});

describe('convertUrlToMd', () => {
  it('should reformat a \\url{} to markdown url', async () => {
    const { md, html } = await testProcessor(`
      Lorem \\url{https://www.google.com} ipsum \\url{https://www.gla.ac.uk} dolor
    `);

    const expectedMd = unindentString(`
      Lorem https://www.google.com ipsum https://www.gla.ac.uk dolor
    `);

    expect(md.trim()).toBe(expectedMd.trim());

    const expectedHtml = unindentString(`
      <p>Lorem <a href="https://www.google.com">https://www.google.com</a> ipsum <a href="https://www.gla.ac.uk">https://www.gla.ac.uk</a> dolor</p>
    `);

    expect(html.trim()).toBe(expectedHtml.trim());
  });

  it('should be idempotent', async () => {
    const { md } = await testProcessor(`
      Lorem \\url{https://www.google.com} ipsum \\url{https://www.gla.ac.uk} dolor
    `);

    const { md: md2 } = await testProcessor(md);

    const expected = unindentString(`
      Lorem https://www.google.com ipsum https://www.gla.ac.uk dolor
    `);

    expect(md2.trim()).toBe(expected.trim());
  });
});
