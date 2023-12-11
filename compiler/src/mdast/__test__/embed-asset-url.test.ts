import { fixtureTestProcessor } from '../../test-utils/fixture-test-processor';

describe('embedAssetUrl', () => {
  it('should embed asset URL for knitr graphics', async () => {
    const html = await fixtureTestProcessor('relative-assets', {
      output: 'html',
    });
    const imgCount = (html.match(/img-wrapper/g) || []).length;
    expect(imgCount).toBe(3);

    // const svgCount = (html.match(/<svg.*?style="width: 70%;".*?>/) || [])
    //   .length;
    // expect(svgCount).toBe(1);

    const figureNum = html
      .match(/<span class="caption-count">Figure (\d+)/g)
      ?.map((s) => Number(s.slice(-1)));

    expect(figureNum).toEqual([1, 2, 3]);
  });

  it('should embed asset URL for browser window', async () => {
    const html = await fixtureTestProcessor('relative-assets', {
      output: 'html',
    });

    expect(html).toContain(
      '<div class="browser-window-content"><img src="',
    );
  });
});
