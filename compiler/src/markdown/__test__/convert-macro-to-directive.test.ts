import {
  testProcessor,
  unindentAndTrimString,
} from '../../test-utils/test-processor';

describe('convertMacroToDirective', () => {
  it('should reformat a macro to directive', async () => {
    const { md } = await testProcessor(`
      ###[example]
      An example of *this*!
      ###[/example]
    `);

    const expected = unindentAndTrimString(`
      :::example
      An example of *this*!
      :::
    `);

    expect(md).toBe(expected);
  });

  it('should reformat a macro with title to directive', async () => {
    const { md } = await testProcessor(`
      ###[example] A title
      An example of *this*!
      ###[/example]
    `);

    const expected = unindentAndTrimString(`
      :::example[A title]
      An example of *this*!
      :::
    `);

    expect(md).toBe(expected);
  });

  it('should be idempotent', async () => {
    const { md } = await testProcessor(`
      ###[example] A title
      An example of *this*!
      ###[/example]
    `);

    const { md: md2 } = await testProcessor(md);

    const expected = unindentAndTrimString(`
      :::example[A title]
      An example of *this*!
      :::
    `);

    expect(md2).toBe(expected);
  });
});
