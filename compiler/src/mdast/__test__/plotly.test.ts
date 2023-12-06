import { fixtureTestProcessor } from '../../test-utils/fixture-test-processor';
// import { ignoreWhitespace } from '../../test-utils/test-processor';

describe('plotly', () => {
  it.skip('should output a plot with interactivity', async () => {
    const html = await fixtureTestProcessor('plotly', {
      output: 'html',
      // noEmbedAssets: false,
      // noDoc: false,
      // noHexagons: true,
    });
    console.log(html);
    // expect(md).toContain('We have already used this');
  });
});
