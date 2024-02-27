import {
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

it('should parse link attrs', async () => {
  const { html } = await testProcessor(`
    the first condition for differentiability in Definition [5](#CMD1.1){reference-type="ref"
    reference="CMD1.1"} is automatically satisfied
  `);

  const expected = unindentString(`
    <p>the first condition for differentiability in Definition <a href="#cmd11" class="reference">5</a> is automatically satisfied</p>
  `);

  expect(html).toBe(expected);
});
