import { testProcessor } from '../../test-utils/test-processor';

describe('environment', () => {
  it('should only show mac and cli sections', async () => {
    const { md } = await testProcessor(`
      ::environment

      :::mac
      I am mac
      :::

      :::windows
      I am windows
      :::

      :::cli
      I am cli
      :::

      :::github-desktop
      I am Github Desktop
      :::
    `);

    console.log(md);
  });
});
