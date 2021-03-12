import fs from 'fs';
import unified from 'unified';
import visit from 'unist-util-visit';
import { Node } from 'unist';
import rehype from 'rehype-parse';

export const rehypeParser = unified().use(rehype, { fragment: true });

export function readFile(
  filePath: string,
  encoding: BufferEncoding = 'utf-8'
) {
  return fs.promises.readFile(filePath, encoding);
}

export function writeFile(filePath: string, contents: string) {
  return fs.promises.writeFile(filePath, contents);
}

export async function checkFileExists(filePath: string) {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
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

export function combineMdastTrees(mdasts: Node[]): Node {
  return {
    type: 'root',
    children: mdasts.flatMap((mdast) => mdast.children || []),
  };
}

export function inspect() {
  return (tree: Node) => {
    console.log(JSON.stringify(tree, null, 2));
    // console.dir(tree, { depth: null });
    // visit(tree, 'leafDirective', (node) => {
    //   console.log('---------------------');
    //   console.dir(node, { depth: null });
    // });
    return tree;
  };
}
