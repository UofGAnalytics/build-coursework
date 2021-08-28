import {
  ignoreWhitespace,
  testProcessor,
  unindentStringAndTrim,
} from '../../test-utils/test-processor';

describe('convertNewPageToDirective', () => {
  it('should reformat a \\newpage to pagebreak directive', async () => {
    const { md } = await testProcessor(`
      \\newpage
    `);

    const expected = unindentStringAndTrim(`
      ::pagebreak
    `);

    expect(ignoreWhitespace(md)).toBe(ignoreWhitespace(expected));
  });

  it('should reformat a \\pagebreak to pagebreak directive', async () => {
    const { md } = await testProcessor(`
      \\pagebreak
    `);

    const expected = unindentStringAndTrim(`
      ::pagebreak
    `);

    expect(ignoreWhitespace(md)).toBe(ignoreWhitespace(expected));
  });

  it('should be idempotent', async () => {
    const { md } = await testProcessor(`
      \\newpage
    `);

    const { md: md2 } = await testProcessor(md);

    const expected = unindentStringAndTrim(`
      ::pagebreak
    `);

    expect(ignoreWhitespace(md2)).toBe(ignoreWhitespace(expected));
  });
});
