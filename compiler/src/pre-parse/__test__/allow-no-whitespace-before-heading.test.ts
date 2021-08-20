import {
  testProcessor,
  unindentStringAndTrim,
} from '../../test-utils/test-processor';

describe('allowNoWhitespaceBeforeHeading', () => {
  it('spot and replace badly formatted heading', async () => {
    const { md } = await testProcessor(`
      ###Deviance
    `);

    const expected = unindentStringAndTrim(`
      ### Deviance
    `);

    expect(md).toBe(expected);
  });

  it('should be idempotent', async () => {
    const { md } = await testProcessor(`
      ###Deviance
    `);

    const expected = unindentStringAndTrim(`
      ### Deviance
    `);

    const { md: md2 } = await testProcessor(md);

    expect(md2).toBe(expected);
  });
});
