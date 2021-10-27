import { testProcessor } from '../../test-utils/test-processor';

// sometimes this works instead ¯\_(ツ)_/¯
// Sys.setenv(RETICULATE_PYTHON = "/usr/bin/python3")
// reticulate::use_python("/opt/homebrew/bin/python3")

describe('python', () => {
  it('should run embedded python', async () => {
    const { md } = await testProcessor(`
      \`\`\`{python}
      print(2**200)
      \`\`\`
    `);
    expect(md).toContain(
      '1606938044258990275541962092341162602522202993782792835301376'
    );
  });
});
