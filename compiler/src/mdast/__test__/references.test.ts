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
});
