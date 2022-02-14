import { fixtureTestProcessor } from '../../test-utils/fixture-test-processor';
import { ignoreWhitespace } from '../../test-utils/test-processor';

describe('multifile knitr state', () => {
  it('should allow knitr state to pass between files', async () => {
    const { md } = await fixtureTestProcessor('multifile-knitr-state');
    console.log(md);
    expect(ignoreWhitespace(md)).toContain('```{.r-output}[1]3```');
  });
});
