import {
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

describe('containerDirective', () => {
  it('should reformat a macro to directive', async () => {
    const { md } = await testProcessor(`
      ###[example]
      An example of *this*!
      ###[/example]
    `);

    const expected = unindentString(`
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

    const expected = unindentString(`
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

    const expected = unindentString(`
      :::example[A title]
      An example of *this*!
      :::
    `);

    expect(md2).toBe(expected);
  });
});
