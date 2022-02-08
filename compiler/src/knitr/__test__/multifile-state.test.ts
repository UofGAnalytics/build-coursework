import { fixtureTestProcessor } from '../../test-utils/fixture-test-processor';

describe('multifile knitr state', () => {
  it('should allow knitr state to pass between files', async () => {
    const { md } = await fixtureTestProcessor('multifile-knitr-state', {
      week: 1,
    });
    console.log(md);
  });
});
