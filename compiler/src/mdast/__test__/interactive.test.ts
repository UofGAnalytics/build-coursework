import { fixtureTestProcessor } from '../../test-utils/fixture-test-processor';

describe('interactive elements', () => {
  it('should display embedded .html', async () => {
    const html = await fixtureTestProcessor('interactive-elements', {
      noEmbedAssets: false,
      output: 'html',
    });

    expect(html).toContain('<div id="multivariate-normal-demo">');
  });
});
