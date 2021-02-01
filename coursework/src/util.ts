import fs from 'fs';
import path from 'path';

export function readFile(filePath: string) {
  const absPath = path.join(process.cwd(), filePath);
  return fs.promises.readFile(absPath, 'utf-8');
}

export function writeFile(filePath: string, contents: string) {
  const absPath = path.join(process.cwd(), filePath);
  return fs.promises.writeFile(absPath, contents);
}

export function mkdir(dirPath: string) {
  return fs.promises.mkdir(dirPath, { recursive: true });
}

export function log(out: any) {
  if (Object(out) !== out) {
    console.log(out);
  } else {
    console.log(JSON.stringify(out, null, 2));
  }
}
