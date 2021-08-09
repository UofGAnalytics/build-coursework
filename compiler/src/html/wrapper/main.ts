import { Node } from 'unist';

export async function createMain(children: Node[]) {
  return {
    type: 'element',
    tagName: 'main',
    children: [
      {
        type: 'element',
        tagName: 'div',
        properties: {
          className: 'wrapper',
        },
        children,
      },
    ],
  };
}

// function createH1(titles: UnitTitles) {
//   return {
//     type: 'element',
//     tagName: 'h1',
//     children: [
//       {
//         type: 'text',
//         value: titles.courseTitle,
//       },
//       {
//         type: 'element',
//         tagName: 'span',
//         properties: {
//           className: 'unit',
//         },
//         children: [
//           {
//             type: 'text',
//             value: titles.unitTitle,
//           },
//         ],
//       },
//     ],
//   };
// }
