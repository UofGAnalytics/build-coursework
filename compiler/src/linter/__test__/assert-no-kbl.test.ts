import { testProcessor } from '../../test-utils/test-processor';

describe('assertNoKbl', () => {
  it.skip('should error on kbl()', async () => {
    const { hasWarningMessage } = await testProcessor(`
      \`\`\`{r, echo=FALSE}
      library(kableExtra)

      a1 <-c("Assessment Component", "Grade %",  "Released", "Due", "Feedback")
      a2 <- c("Quiz 1",	"20%",	"24 May 2021",	"6 June 2021", 	"Upon quiz submission/quiz closed")
      a3 <-c("Assignment 1",	"25%",	"24 May 2021",	"17 June 2021",	"5 July 2021")
      a4 <-c("Quiz 2",	"20%","28 June 2021",	"11 July 2021",	"Upon quiz submission/quiz closed")
      a5 <- c("Assignment 2",	"25%",	"28 June 2021",	"13 July 2021",	"30 July 2021")
      a6<-c("Quiz 3",	"10%",	"12 July 2021",	"25 July 2021",	"Upon quiz submission/quiz closed")

      atab <- rbind(a2,a3,a4,a5,a6)
      colnames(atab) <- a1
      rownames(atab) <- c("1","2","3","4","5")

      atab %>%
        kbl() %>%
        kable_styling(latex_options=c("hold_position"))
      \`\`\`
    `);

    expect(
      hasWarningMessage(
        'kbl() was found. Please note: table styles may not look the same in HTML output'
      )
    ).toBe(true);
  });
});
