import {
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

it('should parse pandoc heading attributes', async () => {
  const { html } = await testProcessor(`
    ## Heading 2 {#test .unnumbered}
  `);

  const expected = unindentString(`
    <h2 id="test" class="unnumbered"><a class="link" href="#test"><svg class="icon link-icon">
          <use href="#link-icon"></use>
        </svg></a>Heading 2</h2>
  `);

  expect(html).toBe(expected);
});

it('should parse multiple classes', async () => {
  const { html } = await testProcessor(`
    ## Heading 2 {#oh-hai .unnumbered.hello}
  `);

  const expected = unindentString(`
    <h2 id="oh-hai" class="unnumbered hello"><a class="link" href="#oh-hai"><svg class="icon link-icon">
          <use href="#link-icon"></use>
        </svg></a>Heading 2</h2>
  `);

  expect(html).toBe(expected);
});

it('should parse only classes', async () => {
  const { html } = await testProcessor(`
    ## Heading 2 {.unnumbered.hello}
  `);

  const expected = unindentString(`
    <h2 class="unnumbered hello" id="heading-2"><a class="link" href="#heading-2"><svg class="icon link-icon">
          <use href="#link-icon"></use>
        </svg></a>Heading 2</h2>
  `);

  expect(html).toBe(expected);
});

it('should parse only id', async () => {
  const { html } = await testProcessor(`
    ## Heading 2 {#hihi}
  `);

  const expected = unindentString(`
    <h2 id="hihi"><a class="link" href="#hihi"><svg class="icon link-icon">
          <use href="#link-icon"></use>
        </svg></a>Heading 2</h2>
  `);

  expect(html).toBe(expected);
});

it('should sluggify attributes', async () => {
  const { html } = await testProcessor(`
    ## PART I. DIFFERENTIATION {#part-i.-differentiation .unnumbered}
  `);

  const expected = unindentString(`
    <h2 id="part-i-differentiation" class="unnumbered"><a class="link" href="#part-i-differentiation"><svg class="icon link-icon">
          <use href="#link-icon"></use>
        </svg></a>PART I. DIFFERENTIATION</h2>
  `);

  expect(html).toBe(expected);
});

it('should parse id with dot', async () => {
  const { html } = await testProcessor(`
    ## Heading 2 {#CMD1.1}
  `);

  const expected = unindentString(`
    <h2 id="cmd11"><a class="link" href="#cmd11"><svg class="icon link-icon">
          <use href="#link-icon"></use>
        </svg></a>Heading 2</h2>
  `);

  expect(html).toBe(expected);
});
