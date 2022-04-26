import path from 'path';

import yaml from 'js-yaml';
import * as yup from 'yup';

import { checkLocalFileExists, readFile } from '../utils/utils';
import { UnitYaml } from './types';

const unitSchema = yup.object().shape({
  name: yup.string().required(),
  title: yup.string().required(),
  content: yup.array().of(
    yup.object().shape({
      src: yup.string().required(),
    })
  ),
});

export async function loadUnitYaml(dirPath: string, src: string) {
  const contentsPath = path.join(dirPath, src);
  if (!(await checkLocalFileExists(contentsPath))) {
    throw Error(
      `No yaml file exists at ${path.join(process.cwd(), contentsPath)}`
    );
  }
  const fileContents = await readFile(contentsPath);
  const unit = yaml.load(fileContents);
  return unitSchema.validateSync(unit) as UnitYaml;
}
