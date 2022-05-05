import { fixtureTestProcessor } from '../../test-utils/fixture-test-processor';

describe('multifile knitr state', () => {
  it('should allow knitr state to pass between files', async () => {
    const html = await fixtureTestProcessor('multifile-knitr-state', {
      output: 'html',
    });
    expect(html).toContain('<code>[1] 3</code>');
    expect(html.replace(/[\\/]+/g, ' ')).toContain(
      'test 1 university-of-glasgow.png'
    );
    expect(html.replace(/[\\/]+/g, ' ')).toContain(
      'test 2 Media_811846_smxx.jpeg'
    );
  });
});
