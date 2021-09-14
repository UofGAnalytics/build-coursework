import { fixtureTestProcessor } from '../../test-utils/fixture-test-processor';

describe('embedAssetUrl', () => {
  it('should embed asset URL for knitr graphics', async () => {
    const { html } = await fixtureTestProcessor('relative-assets', {
      noEmbedAssets: false,
    });
    const count1 = (html.match(/img-wrapper/g) || []).length;
    expect(count1).toBe(3);

    const count2 = (html.match(/<svg.*?style="width: 70%;".*?>/) || [])
      .length;
    expect(count2).toBe(1);
  });
});
