import path from 'path';

import { fixtureTestProcessor } from '../../test-utils/fixture-test-processor';
import {
  ignoreWhitespace,
  // testProcessor,
} from '../../test-utils/test-processor';

describe('loadCourse', () => {
  it('should output a course', async () => {
    const md = await fixtureTestProcessor('basic', { output: 'md' });
    expect(md).toContain('We have already used this');
  });

  // it.only('should output a course2', async () => {
  //   const { html } = await testProcessor(`
  //     Now let us turn our attention to models with a binary response $Y_i \sim \text{Bin}(1,p_i)$. We will go over the main ideas through examples, starting with a light-hearted one.

  //     ###[definition] Deviance residuals
  //     The deviance residual is \begin{align*} d_k &=\text{sign}(y_k-n_k \hat{p}_k) \\
  //     & \times
  //     \left \lbrace 2 \left[ y_k \log \left( \frac{y_k}{n_k \hat{p}_k}\right)+(n_k-y_k) \log \left( \frac{n_k-y_k}{n_k-n_k\hat{p}_k}\right) \right]\right \rbrace^{1/2}.\end{align*}

  //     The standardised deviance residual is
  //     \[r_{Dk}=\frac{d_k}{\sqrt{1-h_k}}.\]
  //     ###[/definition]

  //     We have already used this in models of the form $g(\mu)=\beta_0+\beta1 x$ to test $H_0: \beta_1=0$.
  //   `);
  //   console.log(html);
  //   // expect(md).toContain('We have already used this');
  // });

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

  it.skip('should output a highlighted hexagon for course', async () => {
    const html = await fixtureTestProcessor('basic', {
      output: 'html',
      noDoc: false,
    });

    expect(ignoreWhitespace(html)).toContain('<!--R--><gclass="active">');
  });

  it.skip('should have no highlighted hexagons', async () => {
    const html = await fixtureTestProcessor('basic-no-catalog', {
      output: 'html',
      noDoc: false,
    });

    expect(ignoreWhitespace(html)).not.toContain('<gclass="active">');
  });
});
