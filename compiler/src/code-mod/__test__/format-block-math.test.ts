import { unindentString } from '../../test-utils/test-processor';
import { codeMod } from '../index';

describe('formatBlockMath', () => {
  it('should reformat block math', async () => {
    const md = unindentString(`
      Equation of the GLM: $$\log \left(\dfrac{p_i}{1-p_i} \right)=\beta_0+\beta_1 x_i$$
    `);

    const expected = unindentString(`
      Equation of the GLM:

      $$
      \log \left(\dfrac{p_i}{1-p_i} \right)=\beta_0+\beta_1 x_i
      $$
    `);

    expect(codeMod(md)).toBe(expected);
  });
});
