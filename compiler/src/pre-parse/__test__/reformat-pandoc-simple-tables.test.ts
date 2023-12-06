import {
  ignoreWhitespace,
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

describe('reformatPandocSimpleTables', () => {
  // ignoreWhitespace used in these tests as windows appears to have
  // slightly different spacing near the end of lines which makes no
  // actual difference

  it('should reformat pandoc simple tables to markdown tables', async () => {
    const { html } = await testProcessor(`
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
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th align="left">Movie</th>
              <th align="left">Gross</th>
              <th align="left">Budget</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td align="left">Ek Villain</td>
              <td align="left">95.64</td>
              <td align="left">36.0</td>
            </tr>
            <tr>
              <td align="left">Humshakals</td>
              <td align="left">55.65</td>
              <td align="left">77.0</td>
            </tr>
            <tr>
              <td align="left">Holiday</td>
              <td align="left">110.01</td>
              <td align="left">90.0</td>
            </tr>
            <tr>
              <td align="left">Fugly</td>
              <td align="left">11.16</td>
              <td align="left">16.0</td>
            </tr>
            <tr>
              <td align="left">City Lights</td>
              <td align="left">5.19</td>
              <td align="left">9.5</td>
            </tr>
            <tr>
              <td align="left">Kuku Mathur Ki Jhand Ho Gayi</td>
              <td align="left">2.23</td>
              <td align="left">4.5</td>
            </tr>
          </tbody>
        </table>
      </div>
    `);

    expect(ignoreWhitespace(html)).toBe(ignoreWhitespace(expected));
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

    expect(ignoreWhitespace(md)).toBe(ignoreWhitespace(expected));
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

      :::weblink{target="http://encore.lib.gla.ac.uk/iii/encore/record/C__Rb2939999?lang=eng" icon="book"}
      :::
    `);

    expect(ignoreWhitespace(md)).toBe(ignoreWhitespace(expected));
  });

  it('should reformat pandoc simple table with end separator and empty cells', async () => {
    const { md } = await testProcessor(String.raw`
      Component   Degrees of freedom (df)  Sum of squares (SS)   Mean squares (MS)   F value
      ----------- ------------------------ --------------------- ------------------- ---------------------------------------------
      Model       $p-1$                    $MSS$                 $\frac{MSS}{p-1}$   $\frac{~~\frac{MSS}{p-1}~~}{\frac{RSS}{n-p}}$
      Residual    $n-p$                    $RSS$                 $\frac{RSS}{n-p}$
      Total       $n-1$                    $TSS$
      ----------- ------------------------ --------------------- ------------------- ---------------------------------------------
    `);

    const expected = unindentString(String.raw`
      | Component   | Degrees of freedom (df)  | Sum of squares (SS)   | Mean squares (MS)   | F value                                       |
      | :---------- | :----------------------- | :-------------------- | :------------------ | :-------------------------------------------- |
      | Model       | :inlineMath[0]                    | :inlineMath[1]                 | :inlineMath[2]   | :inlineMath[3] |
      | Residual    | :inlineMath[4]                    | :inlineMath[5]                 | :inlineMath[6]   |                                               |
      | Total       | :inlineMath[7]                    | :inlineMath[8]                 |                     |                                               |
    `);

    expect(ignoreWhitespace(md)).toBe(ignoreWhitespace(expected));
  });

  it('should reformat pandoc simple table with end separator and empty cells and line underneath', async () => {
    const { md } = await testProcessor(String.raw`
      Component   Degrees of freedom (df)  Sum of squares (SS)   Mean squares (MS)   F value
      ----------- ------------------------ --------------------- ------------------- -----------------------------------------
      Model       $p-1$                    $MSS$                 $\frac{MSS}{p-1}$   $\frac{~~\frac{MSS}{p-1}~~}{\frac{RSS}{n-p}}$
      Residual    $n-p$                    $RSS$                 $\frac{RSS}{n-p}$
      Total       $n-1$                    $TSS$
      ----------- ------------------------ --------------------- ------------------- -----------------------------------------

      where $p$ is the total number of estimated regression coefficients.
    `);

    const expected = unindentString(String.raw`
      | Component   | Degrees of freedom (df)  | Sum of squares (SS)   | Mean squares (MS)   | F value                                       |
      | :---------- | :----------------------- | :-------------------- | :------------------ | :-------------------------------------------- |
      | Model       | :inlineMath[0]                    | :inlineMath[1]                 | :inlineMath[2]   | :inlineMath[3] |
      | Residual    | :inlineMath[4]                    | :inlineMath[5]                 | :inlineMath[6]   |                                               |
      | Total       | :inlineMath[7]                    | :inlineMath[8]                 |                     |                                               |

      where :inlineMath[9] is the total number of estimated regression coefficients.
    `);

    expect(ignoreWhitespace(md)).toBe(ignoreWhitespace(expected));
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

    const { html } = await testProcessor(md);

    const expected = unindentString(`
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th align="left">Movie</th>
              <th align="left">Gross</th>
              <th align="left">Budget</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td align="left">Ek Villain</td>
              <td align="left">95.64</td>
              <td align="left">36.0</td>
            </tr>
            <tr>
              <td align="left">Humshakals</td>
              <td align="left">55.65</td>
              <td align="left">77.0</td>
            </tr>
            <tr>
              <td align="left">Holiday</td>
              <td align="left">110.01</td>
              <td align="left">90.0</td>
            </tr>
            <tr>
              <td align="left">Fugly</td>
              <td align="left">11.16</td>
              <td align="left">16.0</td>
            </tr>
            <tr>
              <td align="left">City Lights</td>
              <td align="left">5.19</td>
              <td align="left">9.5</td>
            </tr>
            <tr>
              <td align="left">Kuku Mathur Ki Jhand Ho Gayi</td>
              <td align="left">2.23</td>
              <td align="left">4.5</td>
            </tr>
          </tbody>
        </table>
      </div>
    `);

    expect(ignoreWhitespace(html)).toBe(ignoreWhitespace(expected));
  });
});
