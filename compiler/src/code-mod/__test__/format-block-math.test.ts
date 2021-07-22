import { unindentString } from '../../test-utils/test-processor';
import { codeMod } from '../index';

describe('formatBlockMath', () => {
  it('should reformat block math', async () => {
    const md = unindentString(String.raw`
      Equation of the GLM: $$\log \left(\dfrac{p_i}{1-p_i} \right)=\beta_0+\beta_1 x_i$$
    `);

    const expected = unindentString(String.raw`
      Equation of the GLM:

      $$
      \log \left(\dfrac{p_i}{1-p_i} \right)=\beta_0+\beta_1 x_i
      $$
    `);

    expect(codeMod(md)).toBe(expected);
  });

  it('should reformat block math advanced', async () => {
    const md = unindentString(String.raw`
      (i) GPA = 2.5:
      $$\hat{p}_i = \frac{\exp(-19.207 + 5.454 \times 2.5)} {1+ \exp(-19.207 + 5.454 \times 2.5)} \Rightarrow \hat{p}_i = 0.00378$$

      (ii) GPA = 3:
      $$\hat{p}_i = \frac{\exp(-19.207 + 5.454 \times 3)} {1+ \exp(-19.207 + 5.454 \times 3)} \Rightarrow \hat{p}_i = 0.05494$$

      (iii) GPA = 4:
      $$\hat{p}_i = \frac{\exp(-19.207 + 5.454 \times 4)} {1+ \exp(-19.207 + 5.454 \times 4)} \Rightarrow \hat{p}_i = 0.93143$$
    `);

    const expected = unindentString(String.raw`
      (i) GPA = 2.5:
      $$
      \hat{p}_i = \frac{\exp(-19.207 + 5.454 \times 2.5)} {1+ \exp(-19.207 + 5.454 \times 2.5)} \Rightarrow \hat{p}_i = 0.00378
      $$

      (ii) GPA = 3:
      $$
      \hat{p}_i = \frac{\exp(-19.207 + 5.454 \times 3)} {1+ \exp(-19.207 + 5.454 \times 3)} \Rightarrow \hat{p}_i = 0.05494
      $$

      (iii) GPA = 4:
      $$
      \hat{p}_i = \frac{\exp(-19.207 + 5.454 \times 4)} {1+ \exp(-19.207 + 5.454 \times 4)} \Rightarrow \hat{p}_i = 0.93143
      $$
    `);

    expect(codeMod(md)).toBe(expected);
  });

  it('should be idempotent', async () => {
    const md = unindentString(String.raw`
      Equation of the GLM: $$\log \left(\dfrac{p_i}{1-p_i} \right)=\beta_0+\beta_1 x_i$$
    `);

    const expected = unindentString(String.raw`
      Equation of the GLM:

      $$
      \log \left(\dfrac{p_i}{1-p_i} \right)=\beta_0+\beta_1 x_i
      $$
    `);

    const result = codeMod(md);
    expect(codeMod(result)).toBe(expected);
  });
});
