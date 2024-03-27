import {
  testProcessor,
  unindentString,
} from '../../test-utils/test-processor';

describe('plot accessibility switcher', () => {
  it('should show the plot accessibility switcher correctly', async () => {
    const { html } = await testProcessor(`
      ::::plot-accessibility-switcher
      :::visualisation
      The visualisation
      :::

      :::purpose
      Why does this plot exist?
      :::

      :::description
      What is on this plot?
      :::
      ::::
    `);

    const expected = unindentString(`
      <div class="plot-accessibility-switcher">
        <ul>
          <li data-plot-accessibility="visualisation">Visualisation</li>
          <li data-plot-accessibility="purpose">Purpose</li>
          <li data-plot-accessibility="description">Description</li>
        </ul>
        <div data-plot-accessibility="visualisation" class="plot-accessibility">
          <p>The visualisation</p>
        </div>
        <div data-plot-accessibility="purpose" class="plot-accessibility">
          <p>Why does this plot exist?</p>
        </div>
        <div data-plot-accessibility="description" class="plot-accessibility">
          <p>What is on this plot?</p>
        </div>
      </div>
    `);

    expect(html).toBe(expected);
  });
});
