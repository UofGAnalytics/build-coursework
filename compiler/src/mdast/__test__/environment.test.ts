// import {
//   testProcessor,
//   unindentString,
// } from '../../test-utils/test-processor';

// describe('environment', () => {
//   it('should only show mac and cli sections', async () => {
//     const { html } = await testProcessor(`
//       ::environment

//       :::mac
//       I am mac
//       :::

//       :::windows
//       I am windows
//       :::

//       :::cli
//       I am cli
//       :::

//       :::github-desktop
//       I am Github Desktop
//       :::
//     `);

//     console.log(html);

//     const expected = unindentString(`
//       <div class="platform">
//         <p>I am mac</p>
//       </div>
//       <div class="platform hide">
//         <p>I am windows</p>
//       </div>
//       <div class="program">
//         <p>I am cli</p>
//       </div>
//       <div class="program hide">
//         <p>I am Github Desktop</p>
//       </div>
//     `);

//     expect(html.endsWith(expected)).toBe(true);
//   });
// });
