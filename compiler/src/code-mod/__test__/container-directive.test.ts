import { unindentString } from '../../test-utils/test-processor';
import { codeMod } from '../index';

describe('containerDirective', () => {
  it('should reformat a macro to directive', async () => {
    const md = unindentString(`
      ###[example]
      An example of *this*!
      ###[/example]
    `);

    const expected = unindentString(`
      :::example
      An example of *this*!
      :::
    `);

    expect(codeMod(md)).toBe(expected);
  });

  it('should reformat a macro with title to directive', async () => {
    const md = unindentString(`
      ###[example] A title
      An example of *this*!
      ###[/example]
    `);

    const expected = unindentString(`
      :::example[A title]
      An example of *this*!
      :::
    `);

    expect(codeMod(md)).toBe(expected);
  });

  it('should be idempotent', async () => {
    const md = unindentString(`
      ###[example] A title
      An example of *this*!
      ###[/example]
    `);

    const result = codeMod(md);

    const expected = unindentString(`
      :::example[A title]
      An example of *this*!
      :::
    `);

    expect(codeMod(result)).toBe(expected);
  });
});
