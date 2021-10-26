import { testProcessor } from '../../test-utils/test-processor';

// sometimes this works instead ¯\_(ツ)_/¯
// Sys.setenv(RETICULATE_PYTHON = "/usr/bin/python3")

describe('python', () => {
  it('should run embedded python', async () => {
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

  it('should use the correct python version', async () => {
    const { md } = await testProcessor(`
      \`\`\`{python}
      import platform
      print(platform.python_version())
      \`\`\`
    `);
    const defaultVersion = getPythonVersion(md);

    const { md: md2 } = await testProcessor(
      `
      \`\`\`{python}
      import platform
      print(platform.python_version())
      \`\`\`
    `,
      {
        pythonBin: '/opt/homebrew/bin/python3',
      }
    );

    const customVersion = getPythonVersion(md2);

    console.log({ defaultVersion, customVersion });

    expect(defaultVersion).toBe(customVersion);
  });
});

function getPythonVersion(md: string) {
  const match = md.match(/.python-output\}\s+([0-9.]+)/);
  if (!match) {
    throw new Error('No Python version found');
  }
  return match[1];
}
