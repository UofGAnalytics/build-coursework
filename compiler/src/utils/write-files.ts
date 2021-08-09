// import path from 'path';

// // import pdf from 'html-pdf';
// import { kebabCase } from 'lodash';

// import { getBuildDir, mkdir, writeFile } from './utils';

// export async function writeHtml(
//   unitName: string,
//   html: string,
//   dirPath: string
// ) {
//   const filePath = getFilePath(dirPath, unitName) + '.html';
//   await mkdir(getBuildDir(dirPath));
//   await writeFile(filePath, html);
//   return filePath;
// }

// export async function writePdf(
//   unitName: string,
//   pdf: Buffer,
//   dirPath: string
// ) {
//   const filePath = getFilePath(dirPath, unitName) + '.pdf';
//   await mkdir(getBuildDir(dirPath));
//   await writeFile(filePath, pdf);
//   return filePath;
// }

// TODO: try https://blog.risingstack.com/pdf-from-html-node-js-puppeteer/
// export async function writePdf(
//   unitName: string,
//   pdfHtml: string,
//   dirPath: string
// ) {
//   const filePath = getFilePath(dirPath, unitName) + '.pdf';
//   await mkdir(getBuildDir(dirPath));
//   return new Promise<string>((resolve, reject) => {
//     pdf.create(pdfHtml).toFile(filePath, (err) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(filePath);
//       }
//     });
//   });
// }

// function getFilePath(dirPath: string, unitName: string) {
//   const buildDir = getBuildDir(dirPath);
//   const fileName = kebabCase(unitName);
//   return path.join(buildDir, fileName);
// }
