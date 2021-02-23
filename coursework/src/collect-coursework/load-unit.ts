import path from 'path';
import * as yup from 'yup';
import yaml from 'js-yaml';
import { readFile } from '../util';
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
  const fileContents = await readFile(path.join(dirPath, src));
  const unit = yaml.load(fileContents);
  return unitSchema.validateSync(unit) as UnitYaml;
}
