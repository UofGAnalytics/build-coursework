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

  it('should still work with whitespace after hashes', async () => {
    const { md } = await testProcessor(`
      ###[supplement]
      An example of *this*!
      ### [/supplement]
    `);

    const { md: md2 } = await testProcessor(md);

    const expected = unindentStringAndTrim(`
      :::supplement
      An example of *this*!
      :::
    `);

    expect(ignoreWhitespace(md2)).toBe(ignoreWhitespace(expected));
  });

  it('should convert video macros', async () => {
    const { md } = await testProcessor(`
      ##[video, videoid="5u1w6eROypI", duration="9m57s"] Introduction to GLMs
    `);

    const expected = unindentStringAndTrim(`
      ::video[Introduction to GLMs]{id="5u1w6eROypI" duration="9m57s"}
    `);

    expect(md.trim()).toBe(expected);
  });

  it('should convert video macros with no title', async () => {
    const { md, hasFailingMessage } = await testProcessor(`
      ##[video, videoid="5u1w6eROypI", duration="9m57s"]
    `);

    const expected = unindentStringAndTrim(`
      ::video{id="5u1w6eROypI" duration="9m57s"}
    `);

    expect(md.trim()).toBe(expected);
    expect(hasFailingMessage('Video has no title')).toBe(true);
  });
});
