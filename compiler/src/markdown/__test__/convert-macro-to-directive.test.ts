import {
  ignoreWhitespace,
  testProcessor,
  unindentStringAndTrim,
} from '../../test-utils/test-processor';

describe('convertMacroToDirective', () => {
  it('should reformat a macro to directive', async () => {
    const { md } = await testProcessor(`
      ###[example]
      An example of *this*!
      ###[/example]
    `);

    const expected = unindentStringAndTrim(`
      :::example
      An example of *this*!
      :::
    `);

    expect(ignoreWhitespace(md)).toBe(ignoreWhitespace(expected));
  });

  it('should reformat a macro with title to directive', async () => {
    const { md } = await testProcessor(`
      ###[example] A title
      An example of *this*!
      ###[/example]
    `);

    const expected = unindentStringAndTrim(`
      :::example[A title]
      An example of *this*!
      :::
    `);

    expect(ignoreWhitespace(md)).toBe(ignoreWhitespace(expected));
  });

  it('should be idempotent', async () => {
    const { md } = await testProcessor(`
      ###[example] A title
      An example of *this*!
      ###[/example]
    `);

    const { md: md2 } = await testProcessor(md);

    const expected = unindentStringAndTrim(`
      :::example[A title]
      An example of *this*!
      :::
    `);

    expect(ignoreWhitespace(md2)).toBe(ignoreWhitespace(expected));
  });
});
