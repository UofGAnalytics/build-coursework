import {
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

describe('allowNoWhitespaceBeforeHeading', () => {
  it('spot and replace badly formatted heading', async () => {
    const { md } = await testProcessor(`
      ###Deviance
    `);

    const expected = unindentString(`
      ### Deviance
    `);

    expect(md.trim()).toBe(expected.trim());
  });

  it('spot and replace badly formatted multi-word heading', async () => {
    const { md } = await testProcessor(`
      ###Deviance and Cheese
    `);

    const expected = unindentString(`
      ### Deviance and Cheese
    `);

    expect(md.trim()).toBe(expected.trim());
  });

  it('should be idempotent', async () => {
    const { md } = await testProcessor(`
      ###Deviance
    `);

    const expected = unindentString(`
      ### Deviance
    `);

    const { md: md2 } = await testProcessor(md);

    expect(md2.trim()).toBe(expected.trim());
  });
});
