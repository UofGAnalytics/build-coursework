import yaml from 'js-yaml';
import * as yup from 'yup';

import { readFile } from '../utils/utils';
import { CourseYaml } from './types';

const courseSchema = yup.object().shape({
  title: yup.string().required(),
  units: yup.array().of(
    yup.object().shape({
      src: yup.string().required(),
    })
  ),
});

export async function loadCourseYaml(dirPath: string) {
  const fileContents = await readFile(`${dirPath}/course.yaml`);
  const course = yaml.load(fileContents);
  return courseSchema.validateSync(course) as CourseYaml;
}
