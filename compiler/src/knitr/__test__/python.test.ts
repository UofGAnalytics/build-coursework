import { testProcessor } from '../../test-utils/test-processor';

describe('python', () => {
  it('python should work correctly', async () => {
    const { md } = await testProcessor(`
      \`\`\`{r setup, echo=FALSE}
      reticulate::use_python("/usr/bin/python3")
      \`\`\`

      \`\`\`{python}
      print(2**200)
      \`\`\`
    `);
    expect(md).toContain(
      '1606938044258990275541962092341162602522202993782792835301376'
    );
  });
});
