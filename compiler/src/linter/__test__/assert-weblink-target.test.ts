import { testProcessor } from '../../test-utils/test-processor';

describe('assertWeblinkTarget', () => {
  it.skip('should fail on weblink with no target', async () => {
    const { hasFailingMessage } = await testProcessor(
      `
        ::::weblink
        Weblink description
        ::::
      `,
      { shouldFail: true }
    );

    expect(hasFailingMessage('Weblink has no target attribute')).toBe(
      true
    );
  });
});
