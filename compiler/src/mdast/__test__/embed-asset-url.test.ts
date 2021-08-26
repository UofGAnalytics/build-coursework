import { fixtureTestProcessor } from '../../test-utils/fixture-test-processor';

describe('embedAssetUrl', () => {
  it('should embed asset URL for knitr graphics', async () => {
    const { html } = await fixtureTestProcessor('relative-assets');
    expect(html).toContain('<img src="data:image/png;base64');
  });
});
