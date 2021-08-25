import { rMarkdown } from '../..';

describe('embedAssetUrl', () => {
  it('should embed asset URL for knitr graphics', async () => {
    const result = await rMarkdown('./fixtures/relative-assets', {
      noDoc: true,
      noCache: true,
      noPdf: true,
      noReport: true,
    });

    console.log(result);
  });
});
