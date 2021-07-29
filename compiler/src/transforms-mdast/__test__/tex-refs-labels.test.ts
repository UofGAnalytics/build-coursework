import { testProcessor } from '../../test-utils/test-processor';

describe('latexReferences', () => {
  it.skip('should add references correctly', async () => {
    const { html } = await testProcessor(String.raw`
      Expressed as functions of the $\beta_j$:

      \begin{align} U_j=\frac{\partial l}{\partial \beta_j} &= \sum_{i=1}^n \left [   \frac{\partial l_i}{\partial \beta_j}  \right]= \sum_{i=1}^n \left [   \frac{\partial l_i}{\partial \theta_i} \cdot \frac{\partial \theta_i}{\partial \mu_i} \cdot \frac{\partial \mu_i} {\partial \beta_j}  \right] \label{eqn:chainrule}           \end{align}

      For an exponential family distribution in canonical form, the components of (\ref{eqn:chainrule}) are:

      \begin{align} &\frac{\partial l_i}{\partial \theta_i} = y_i b'(\theta) +c'(\theta)=b'(\theta) \left[y_i -\left(-\frac{c'(\theta)}{b'(\theta)}\right) \right]=b' (\theta) (y_i - \mu_i) \label{eqn:dldtheta}\\
      & \frac{\partial \mu_i}{\partial \theta_i} = -\frac{c''(\theta_i)}{b'(\theta_i)}+\frac{c'(\theta_i) b''(\theta_i)}{[b'(\theta_i)]^2} = b'(\theta_i) \mathrm{Var}(Y_i)  \nonumber \\ & \Rightarrow  \frac{\partial \theta_i}{\partial \mu_i}= \frac{1}{b'(\theta_i) \mathrm{Var}(Y_i)} \label{eqn:dmudtheta}\\
      &\frac{\partial \mu_i}{\partial \beta_j}=\frac{\partial \mu_i}{\partial \eta_i}\cdot \frac{\partial \eta_i}{\partial \beta_j}=\frac{\partial \mu_i}{\partial \eta_i}x_{ij}=\frac{x_{ij}}{g'(\mu_i)} \label{eqn:dmudbeta}
      \end{align}

      Substituting (\ref{eqn:dldtheta}), (\ref{eqn:dmudtheta}) and (\ref{eqn:dmudbeta}) into (\ref{eqn:chainrule}) the expression for the scores becomes

      \begin{align} &U_j=\sum_{i=1}^n \left[  \frac{(y_i-\mu_i)}{\mathrm{Var}(Y_i)}x_{ij} \frac{\partial \mu_i}{\partial \eta_i}\right]=\sum_{i=1}^n \left[  \frac{(y_i-\mu_i)}{\mathrm{Var}(Y_i)}\frac{x_{ij}} {g'(\mu_i)}\right]. \label{eqn:score}\end{align}
    `);

    console.log(html);

    // delay jest output
    // await new Promise((resolve) => {
    //   setTimeout(resolve, 3000);
    // });
  });
});
