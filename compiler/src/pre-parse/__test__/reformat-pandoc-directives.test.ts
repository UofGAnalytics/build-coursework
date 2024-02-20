import {
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

describe('reformatPandocDirectives', () => {
  it('should remove whitespace from pandoc directives', async () => {
    const { md, html } = await testProcessor(`
      ::: lemma
      Test
      :::
    `);

    const expectedMd = unindentString(`
      :::lemma
      Test
      :::
    `);

    expect(md.trim()).toBe(expectedMd.trim());

    const expectedHtml = unindentString(`
      <div class="boxout lemma" id="lemma-1"><span class="type">Lemma 1</span>
        <p>Test</p>
      </div>
    `);

    expect(html).toBe(expectedHtml);
  });

  it('should reformat pandoc directives shown as class names', async () => {
    const { md } = await testProcessor(`
      ::: definition
      hi 1
      :::

      ::: {.definition}
      hi 2
      :::

      ::: {#CMD1.1 .definition}
      hi 3
      :::

      ::: {#CMD1.1 .definition.other}
      hi 4
      :::

      ::: {#CMD1.1 .other.definition}
      hi 5
      :::

      ::: {#CMD1.1}
      hi 6
      :::

      ::: {#CMD1.1 .other}
      hi 7
      :::
    `);

    const expectedMd = unindentString(`
      :::definition
      hi 1
      :::

      :::definition
      hi 2
      :::

      :::definition {#CMD1.1}
      hi 3
      :::

      :::definition {#CMD1.1 .other}
      hi 4
      :::

      :::definition {#CMD1.1 .other}
      hi 5
      :::

      :::{#CMD1.1}
      hi 6
      :::

      :::{#CMD1.1 .other}
      hi 7
      :::
    `);

    expect(md.trim()).toBe(expectedMd.trim());
  });
});
