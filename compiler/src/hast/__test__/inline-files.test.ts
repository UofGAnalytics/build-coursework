import { testProcessor } from '../../test-utils/test-processor';

describe('inline-files', () => {
  it('should only inline an external script once', async () => {
    const { html } = await testProcessor(
      `
      \`\`\`gitgraph
      const master = gitgraph.branch("master");
      master.commit("Initial commit 1");
      \`\`\`

      \`\`\`gitgraph
      const master = gitgraph.branch("master");
      master.commit("Initial commit 2");
      \`\`\`
    `,
      { noEmbedAssets: false }
    );

    const match = html.match(
      /<script>\/\/ https:\/\/cdn.jsdelivr.net\/npm\/@gitgraph\/js/g
    );

    expect((match || []).length).toBe(1);
  });
});
