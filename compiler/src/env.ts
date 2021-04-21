import { readFile } from './utils/utils';

export function getTemplateCss() {
  return readFile('../template/build/main.css');
}

export function getTemplateJs() {
  return readFile('../template/build/main.js');
}

export function getAsset(assetName: string) {
  return readFile(`./assets/${assetName}`);
}
