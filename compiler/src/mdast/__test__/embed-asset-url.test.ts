import { fixtureTestProcessor } from '../../test-utils/fixture-test-processor';

describe('embedAssetUrl', () => {
  it('should embed asset URL for knitr graphics', async () => {
    const { html } = await fixtureTestProcessor('relative-assets');
    const count = (html.match(/img-wrapper/g) || []).length;
    expect(count).toBe(3);
  });
});
