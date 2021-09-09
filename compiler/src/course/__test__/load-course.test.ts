import { fixtureTestProcessor } from '../../test-utils/fixture-test-processor';

describe('loadCourse', () => {
  it('should error when trying to process week that does not exist', async () => {
    await expect(
      fixtureTestProcessor('basic', { week: 2 })
    ).rejects.toThrow('Week 2 not found in fixtures/basic/course.yaml');
  });
});
