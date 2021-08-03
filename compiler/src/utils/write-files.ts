import path from 'path';

import pdf from 'html-pdf';
import { kebabCase } from 'lodash';

import { getBuildDir, mkdir, writeFile } from './utils';

export async function writeHtml(
  fileName: string,
  html: string,
  dirPath: string
) {
  const filePath = getFilePath(dirPath, fileName);
  await mkdir(dirPath);
  await writeFile(`${filePath}.html`, html);
  console.log('html file written to:', `${filePath}.html`);
}

export async function writePdf(
  fileName: string,
  pdfHtml: string,
  dirPath: string
) {
  const filePath = getFilePath(dirPath, fileName);
  await writePdfPromise(`${filePath}.pdf`, pdfHtml);
  console.log('pdf file written to:', `${filePath}.pdf`);
}

async function writePdfPromise(filePath: string, html: string) {
  return new Promise<void>((resolve, reject) => {
    pdf.create(html).toFile(filePath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function getFilePath(dirPath: string, unitName: string) {
  const buildDir = getBuildDir(dirPath);
  const fileName = kebabCase(unitName);
  return path.join(buildDir, fileName);
}
