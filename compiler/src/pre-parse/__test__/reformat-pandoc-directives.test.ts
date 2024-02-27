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
    const { md, html } = await testProcessor(`
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

      :::definition{#cmd11}
      hi 3
      :::

      :::definition{#cmd11 .other}
      hi 4
      :::

      :::definition{#cmd11 .other}
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

    const expectedHtml = unindentString(`
      <div class="boxout definition" id="definition-1"><span class="type">Definition 1</span>
        <p>hi 1</p>
      </div>
      <div class="boxout definition" id="definition-2"><span class="type">Definition 2</span>
        <p>hi 2</p>
      </div>
      <div class="boxout definition" id="cmd11"><span class="type">Definition 3</span>
        <p>hi 3</p>
      </div>
      <div class="boxout definition" id="cmd11"><span class="type">Definition 4</span>
        <p>hi 4</p>
      </div>
      <div class="boxout definition" id="cmd11"><span class="type">Definition 5</span>
        <p>hi 5</p>
      </div>
      <p>
        :::{#CMD1.1}
        hi 6
        :::
      </p>
      <p>
        :::{#CMD1.1 .other}
        hi 7
        :::
      </p>
    `);

    expect(html).toBe(expectedHtml);
  });
});
