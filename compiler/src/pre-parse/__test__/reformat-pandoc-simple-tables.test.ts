import {
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

describe('reformatPandocSimpleTables', () => {
  it('should reformat pandoc simple tables to markdown tables', async () => {
    const { md } = await testProcessor(`
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

    expect(md.trim()).toBe(expected.trim());
  });

  it('should reformat pandoc simple tables to markdown tables with LaTeX', async () => {
    const { md } = await testProcessor(String.raw`
      **Model**                 **Random component**                                **Systematic component**                                    **Link function**
      ------------------------- --------------------------------------------------- ----------------------------------------------------------- --------------------------------
      Normal model              $y_i\overset{\text{indep}}\sim N(\mu_i,\sigma^2),$  $\boldsymbol{x}_i^T\boldsymbol{\beta}=\beta_0+\beta_1x_i$   Identity link $g(\mu_i)=\mu_i$
                                $E(Y_i)=\mu_i$
      Logistic regression       $y_i\overset{\text{indep}}\sim Bin(1,p_i),$         $\boldsymbol{x}_{i}^T\boldsymbol{\beta} =\beta_0+\beta_1x_i$  Logit link: $g(\mu_i)=\log \left(\frac{\mu_i}{1-\mu_i}\right)= \log \left(\frac{p_i}{1-p_i}\right)$
      model                     $E(Y_i)=p_i$
    `);

    // const expected = unindentStringAndTrim(String.raw`
    //   | **Model**                  | **Random component**                                              | **Systematic component**                                     | **Link function**                                                                                   |
    //   | :------------------------- | :---------------------------------------------------------------- | :----------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- |
    //   | Normal model               | $y_i\overset{\text{indep}}\sim N(\mu_i,\sigma^2),$ $E(Y_i)=\mu_i$ | $\boldsymbol{x}_i^T\boldsymbol{\beta}=\beta_0+\beta_1x_i$    | Identity link $g(\mu_i)=\mu_i$                                                                      |
    //   | Logistic regression model  | $y_i\overset{\text{indep}}\sim Bin(1,p_i),$ $E(Y_i)=p_i$          | $\boldsymbol{x}_{i}^T\boldsymbol{\beta} =\beta_0+\beta_1x_i$ | Logit link: $g(\mu_i)=\log \left(\frac{\mu_i}{1-\mu_i}\right)= \log \left(\frac{p_i}{1-p_i}\right)$ |
    // `);

    const expected = unindentString(String.raw`
      | **Model**                 | **Random component**                                              | **Systematic component**                                     | **Link function**                                                                                   |
      | :------------------------ | :---------------------------------------------------------------- | :----------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- |
      | Normal model              | :inlineMath[0] :inlineMath[1] | :inlineMath[2]    | Identity link :inlineMath[3]                                                                      |
      | Logistic regression model | :inlineMath[4] :inlineMath[5]          | :inlineMath[6] | Logit link: :inlineMath[7] |
    `);

    expect(md.trim()).toBe(expected.trim());
  });

  it('should reformat pandoc simple tables to markdown tables with macro syntax after', async () => {
    const { md } = await testProcessor(String.raw`
      **Distribution**   **Natural parameter**                         **Canonical link**
      ------------------ --------------------------------------------- ----------------------
      Normal             $\dfrac{\theta}{\sigma^2}$                    $g(\mu)=\mu$
      Poisson            $\log \theta$                                 $g(\mu)=\log(\mu)$
      Binomial           $\log\left(\dfrac{\theta}{1-\theta} \right)$  $g(\mu)=\log\left(\dfrac{\mu}{1-\mu} \right)$

      ###[weblink,target="http://encore.lib.gla.ac.uk/iii/encore/record/C__Rb2939999?lang=eng",icon=book]
    `);

    const expected = unindentString(String.raw`
      | **Distribution**   | **Natural parameter**                         | **Canonical link**                            |
      | :----------------- | :-------------------------------------------- | :-------------------------------------------- |
      | Normal             | :inlineMath[0]                    | :inlineMath[1]                                  |
      | Poisson            | :inlineMath[2]                                 | :inlineMath[3]                            |
      | Binomial           | :inlineMath[4]  | :inlineMath[5] |

      :::weblink{target="http://encore.lib.gla.ac.uk/iii/encore/record/C__Rb2939999?lang=eng" icon=book}
    `);

    expect(md.trim()).toBe(expected.trim());
  });

  it('should be idempotent', async () => {
    const { md } = await testProcessor(`
      Movie                            Gross       Budget
      -------------------------------- ----------- -----------
        Ek Villain                       95.64       36.0
        Humshakals                       55.65       77.0
        Holiday                         110.01      90.0
        Fugly                            11.16       16.0
        City Lights                       5.19        9.5
        Kuku Mathur Ki Jhand Ho Gayi      2.23        4.5
    `);

    const { md: md2 } = await testProcessor(md);

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

    expect(md2.trim()).toBe(expected.trim());
  });
});
