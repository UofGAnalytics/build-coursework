import { unindentString } from '../../test-utils/test-processor';
import { codeMod } from '../index';

describe('reformatPandocSimpleTables', () => {
  it('should reformat pandoc simple tables to markdown tables', async () => {
    const md = unindentString(`
      Movie                            Gross       Budget
      -------------------------------- ----------- -----------
        Ek Villain                       95.64       36.0
        Humshakals                       55.65       77.0
        Holiday                         110.01      90.0
        Fugly                            11.16       16.0
        City Lights                       5.19        9.5
        Kuku Mathur Ki Jhand Ho Gayi      2.23        4.5
    `);

    const expected = unindentString(`
      | Movie                            | Gross       | Budget |
      | :------------------------------- | :---------- | :----- |
      | Ek Villain                       | 95.64       | 36.0   |
      | Humshakals                       | 55.65       | 77.0   |
      | Holiday                          | 110.01      | 90.0   |
      | Fugly                            | 11.16       | 16.0   |
      | City Lights                      | 5.19        | 9.5    |
      | Kuku Mathur Ki Jhand Ho Gayi     | 2.23        | 4.5    |
    `);

    expect(codeMod(md)).toBe(expected);
  });

  it('should reformat pandoc simple tables to markdown tables advanced', async () => {
    const md = unindentString(String.raw`
      **Model**                  **Random component**                                **Systematic component**                                    **Link function**
      -------------------------- --------------------------------------------------- ----------------------------------------------------------- --------------------------------
      Normal model               $y_i\overset{\text{indep}}\sim N(\mu_i,\sigma^2),$  $\boldsymbol{x}_i^T\boldsymbol{\beta}=\beta_0+\beta_1x_i$   Identity link $g(\mu_i)=\mu_i$
                                 $E(Y_i)=\mu_i$
      Logistic regression        $y_i\overset{\text{indep}}\sim Bin(1,p_i),$         $\boldsymbol{x}_{i}^T\boldsymbol{\beta} =\beta_0+\beta_1x_i$  Logit link: $g(\mu_i)=\log \left(\frac{\mu_i}{1-\mu_i}\right)= \log \left(\frac{p_i}{1-p_i}\right)$
      model                      $E(Y_i)=p_i$
    `);

    const expected = unindentString(String.raw`
      | **Model**                  | **Random component**                                              | **Systematic component**                                     | **Link function**                                                                                   |
      | :------------------------- | :---------------------------------------------------------------- | :----------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- |
      | Normal model               | $y_i\overset{\text{indep}}\sim N(\mu_i,\sigma^2),$ $E(Y_i)=\mu_i$ | $\boldsymbol{x}_i^T\boldsymbol{\beta}=\beta_0+\beta_1x_i$    | Identity link $g(\mu_i)=\mu_i$                                                                      |
      | Logistic regression model  | $y_i\overset{\text{indep}}\sim Bin(1,p_i),$ $E(Y_i)=p_i$          | $\boldsymbol{x}_{i}^T\boldsymbol{\beta} =\beta_0+\beta_1x_i$ | Logit link: $g(\mu_i)=\log \left(\frac{\mu_i}{1-\mu_i}\right)= \log \left(\frac{p_i}{1-p_i}\right)$ |
    `);

    expect(codeMod(md)).toBe(expected);
  });

  it('should be idempotent', async () => {
    const md = unindentString(`
      Movie                            Gross       Budget
      -------------------------------- ----------- -----------
        Ek Villain                       95.64       36.0
        Humshakals                       55.65       77.0
        Holiday                         110.01      90.0
        Fugly                            11.16       16.0
        City Lights                       5.19        9.5
        Kuku Mathur Ki Jhand Ho Gayi      2.23        4.5
    `);

    const expected = unindentString(`
      | Movie                            | Gross       | Budget |
      | :------------------------------- | :---------- | :----- |
      | Ek Villain                       | 95.64       | 36.0   |
      | Humshakals                       | 55.65       | 77.0   |
      | Holiday                          | 110.01      | 90.0   |
      | Fugly                            | 11.16       | 16.0   |
      | City Lights                      | 5.19        | 9.5    |
      | Kuku Mathur Ki Jhand Ho Gayi     | 2.23        | 4.5    |
    `);

    const result = codeMod(md);
    expect(codeMod(result)).toBe(expected);
  });
});
