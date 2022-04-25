import {
  ignoreWhitespace,
  testProcessor,
} from '../../test-utils/test-processor';

// <figure class="img-wrapper" id="#my-alt-text">
//   <img src="/var/folders/dy/tzrrqxmx7_701rcnq9dnvfvh0000gp/T" alt="My alt text">
//   <figcaption>
//     <a href="#my-alt-text">
//       <span class="caption-count">Figure 1: </span>
//       My alt text
//     </a>
//   </figcaption>
// </figure>

describe('images', () => {
  it('should render an html figure', async () => {
    const { html } = await testProcessor(`
      ![]()
    `);

    expect(ignoreWhitespace(html)).toMatch(
      /<figureclass="img-wrapper"id="figure-1"><imgsrc=".+"alt=""><figcaption><ahref="#figure-1"><spanclass="caption-count">Figure1<\/span><\/a><\/figcaption><\/figure>/
    );
  });

  it('should render an html figure with alt text', async () => {
    const { html } = await testProcessor(`
      ![My alt text]()
    `);

    expect(ignoreWhitespace(html)).toMatch(
      /<figureclass="img-wrapper"id="my-alt-text"><imgsrc=".+"alt="Myalttext"><figcaption><ahref="#my-alt-text"><spanclass="caption-count">Figure1:<\/span>Myalttext<\/a><\/figcaption><\/figure>/
    );
  });
});
