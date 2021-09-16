import { fixtureTestProcessor } from '../../test-utils/fixture-test-processor';

describe('embedAssetUrl', () => {
  it('should embed asset URL for knitr graphics', async () => {
    const { html } = await fixtureTestProcessor('relative-assets', {
      noEmbedAssets: false,
    });
    const imgCount = (html.match(/img-wrapper/g) || []).length;
    expect(imgCount).toBe(3);

    const svgCount = (html.match(/<svg.*?style="width: 70%;".*?>/) || [])
      .length;
    expect(svgCount).toBe(1);
  });
});
