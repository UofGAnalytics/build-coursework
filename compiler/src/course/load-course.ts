import path from 'path';

import yaml from 'js-yaml';
import * as yup from 'yup';

import { checkLocalFileExists, readFile } from '../utils/utils';
import { CourseYaml } from './types';

export const validCatalogValues = [
  'STATS5077',
  'STATS5078',
  'STATS5075',
  'STATS5084',
  'STATS5074',
  'STATS5081',
  'STATS5080',
  'STATS5073',
  'STATS5076',
  'STATS5079',
  'STATS5082',
  'STATS5094',
  'STATS5083',
];

const courseSchema = yup.object().shape({
  title: yup.string().required(),
  units: yup.array().of(
    yup.object().shape({
      src: yup.string().required(),
    })
  ),
  catalog: yup.string().oneOf(validCatalogValues).required(),
  authors: yup.string().required(),
  academic_year: yup.string().required(),
});

export async function loadCourseYaml(dirPath: string) {
  const courseYamlPath = path.join(dirPath, 'course.yaml');
  if (!(await checkLocalFileExists(courseYamlPath))) {
    throw Error(
      `No course.yaml file exists in ${path.join(process.cwd(), dirPath)}`
    );
  }
  const fileContents = await readFile(courseYamlPath);
  const course = yaml.load(fileContents);
  return courseSchema.validateSync(course) as CourseYaml;
}
