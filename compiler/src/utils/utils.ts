import fs from 'fs';
import path from 'path';

import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import { Node, Parent } from 'unist';

// import { visit } from 'unist-util-visit';

export const rehypeParser = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeStringify);

export function readFile(
  filePath: string,
  encoding: BufferEncoding = 'utf-8',
) {
  return fs.promises.readFile(filePath, encoding);
}

export function writeFile(filePath: string, value: string | Buffer) {
  return fs.promises.writeFile(filePath, value);
}

export async function checkLocalFileExists(filePath: string) {
  try {
    await fs.promises.access(
      filePath,
      fs.promises.constants.R_OK | fs.promises.constants.W_OK,
    );
    return true;
  } catch {
    return false;
  }
}

export async function rmFile(filePath: string) {
  return fs.promises.unlink(filePath);
}

export function mkdir(dirPath: string) {
  return fs.promises.mkdir(dirPath, { recursive: true });
}

export function rmdir(dirPath: string) {
  return fs.promises.rmdir(dirPath, { recursive: true });
}

export function getBuildDir(dirPath: string) {
  return path.join(process.cwd(), dirPath, 'build');
}

export function getCacheDir(dirPath: string) {
  return path.join(process.cwd(), dirPath, 'cache');
}

export function getTemplateDir() {
  if (process.env.NODE_ENV === 'production') {
    return __dirname;
  }
  return path.join(process.cwd(), 'template', 'build');
}

export function combineMdastTrees(mdasts: Parent[]): Parent {
  const children = mdasts.flatMap(
    (mdast) => mdast.children || [],
  ) as Node[];
  return { type: 'root', children };
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
