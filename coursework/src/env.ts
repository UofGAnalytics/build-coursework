import { readFile } from './util';

export function getTemplateCss() {
  return readFile('../template/build/main.css');
}

export function getTemplateJs() {
  return readFile('../template/build/main.js');
}
