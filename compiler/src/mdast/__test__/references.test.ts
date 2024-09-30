import {
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

describe('references', () => {
  it('should render a reference', async () => {
    const { html } = await testProcessor(`
      ####[example, label=ExBigBear] My title
      Argh
      ####[/example]

      And once I saw a ref://ExBigBear and another ref://ExBigBear
    `);

    const expected = unindentString(`
      <div class="boxout example" id="example-1"><span class="type">Example 1</span>
        <h3 id="my-title"><a class="link" href="#my-title"><svg class="icon link-icon">
              <use href="#link-icon"></use>
            </svg></a>My title</h3>
        <p>Argh</p>
      </div>
      <p>And once I saw a <a href="#example-1">Example 1</a> and another <a href="#example-1">Example 1</a></p>
    `);

    expect(html).toBe(expected);
  });

  it('should render a reference2', async () => {
    const { html } = await testProcessor(String.raw`
      :::definition[Score statistic]{label=defScoreuniv}
      Hello
      :::

      :::supplement
      Definition ref://defScoreuniv
      :::
    `);

    const expected = unindentString(`
      <div class="boxout definition" id="definition-1"><span class="type">Definition 1</span>
        <h3 id="score-statistic"><a class="link" href="#score-statistic"><svg class="icon link-icon">
              <use href="#link-icon"></use>
            </svg></a>Score statistic</h3>
        <p>Hello</p>
      </div>
      <div class="boxout supplement" id="supplement-1"><span class="type">Supplement 1</span>
        <p>Definition <a href="#definition-1">Definition 1</a></p>
      </div>
    `);

    expect(html).toBe(expected);
  });
});
