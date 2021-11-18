import path from 'path';

import { fixtureTestProcessor } from '../../test-utils/fixture-test-processor';

describe('loadCourse', () => {
  it('should error when trying to process week that does not exist', async () => {
    const courseYaml = path.join('fixtures', 'basic', 'course.yaml');
    await expect(
      fixtureTestProcessor('basic', { week: 2 })
    ).rejects.toThrow(`Week 2 not found in ${courseYaml}`);
  });

  it('should not error when generating a pdf', async () => {
    await fixtureTestProcessor('basic', { noPdf: false });
    expect(true).toBe(true);
  }, 60000);
});
