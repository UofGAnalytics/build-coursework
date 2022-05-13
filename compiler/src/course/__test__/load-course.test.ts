import path from 'path';

import { fixtureTestProcessor } from '../../test-utils/fixture-test-processor';
import { ignoreWhitespace } from '../../test-utils/test-processor';

describe('loadCourse', () => {
  it('should output a course', async () => {
    const md = await fixtureTestProcessor('basic', { output: 'md' });
    expect(md).toContain('We have already used this');
  });

  it('should error when trying to process week that does not exist', async () => {
    const courseYaml = path.join('fixtures', 'basic', 'course.yaml');

    try {
      await fixtureTestProcessor('basic', { week: 2, shouldFail: true });
    } catch (err) {
      expect(err).toContain(`Week 2 not found in ${courseYaml}`);
    }
  });

  it('should not error when generating a pdf', async () => {
    await fixtureTestProcessor('basic', { noPdf: false });
    expect(true).toBe(true);
  }, 60000);

  it('should output a highlighted hexagon for course', async () => {
    const html = await fixtureTestProcessor('basic', {
      output: 'html',
      noDoc: false,
    });

    expect(ignoreWhitespace(html)).toContain('<!--R--><gclass="active">');
  });

  it.only('should have no highlighted hexagons', async () => {
    const html = await fixtureTestProcessor('basic-no-catalog', {
      output: 'html',
      noDoc: false,
    });

    expect(ignoreWhitespace(html)).not.toContain('<gclass="active">');
  });
});
