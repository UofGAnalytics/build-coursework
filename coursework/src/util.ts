import fs from 'fs';
import unified from 'unified';
import rehype from 'rehype-parse';

export const rehypeParser = unified().use(rehype, { fragment: true });

export function readFile(filePath: string) {
  return fs.promises.readFile(filePath, 'utf-8');
}

export function writeFile(filePath: string, contents: string) {
  return fs.promises.writeFile(filePath, contents);
}

export function mkdir(dirPath: string) {
  return fs.promises.mkdir(dirPath, { recursive: true });
}

export function rmdir(dirPath: string) {
  return fs.promises.rmdir(dirPath, { recursive: true });
}

export function getBuildDir(dirPath: string) {
  return `${dirPath}/build`;
}

export function getCacheDir(dirPath: string) {
  return `${dirPath}/cache`;
}

export function getTemplateCss() {
  return fs.promises.readFile('../template/build/main.css');
}

export function getTemplateJs() {
  return fs.promises.readFile('../template/build/main.js');
}
