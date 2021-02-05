import fs from 'fs';

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

export function log(out: any) {
  if (Object(out) !== out) {
    console.log(out);
  } else {
    console.log(JSON.stringify(out, null, 2));
  }
}
