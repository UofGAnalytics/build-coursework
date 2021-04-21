import { testProcessor } from '../../test-utils/test-processor';

describe('assertWeblinkTarget', () => {
  it('should fail on weblink with no target', async () => {
    const { file, hasFailingMessage } = await testProcessor(`
      ::::weblink
      Weblink description
      ::::
    `);
    expect(
      hasFailingMessage(file, 'Weblink has no target attribute')
    ).toBe(true);
  });
});
