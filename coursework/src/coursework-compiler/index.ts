import path from 'path';
import yaml from 'js-yaml';
import * as yup from 'yup';
import { readFile } from '../util';
import { renderHtml } from '../markdown-parser';

export type CourseWork = {
  title: string;
  units: Array<
    UnitYaml & {
      markdown: string[];
      html: string[];
    }
  >;
};

export async function courseworkCompiler(
  dirPath: string
): Promise<CourseWork> {
  const course = await loadCourseYaml(dirPath);
  const units = await Promise.all(
    course.units.map(async (unit) => compileUnit(dirPath, unit))
  );
  return { ...course, units };
}

async function compileUnit(dirPath: string, unit: { src: string }) {
  const yaml = await loadUnitYaml(dirPath, unit.src);
  const markdown = await Promise.all(
    yaml.content.map((c) =>
      readFile(path.join(dirPath, unit.src, '..', c.src))
    )
  );
  const html = markdown.map(renderHtml);
  return { ...yaml, markdown, html };
}

type CourseYaml = {
  title: string;
  units: { src: string }[];
};

const courseSchema = yup.object().shape({
  title: yup.string().required(),
  units: yup.array().of(
    yup.object().shape({
      src: yup.string().required(),
    })
  ),
});

async function loadCourseYaml(dirPath: string) {
  const fileContents = await readFile(`${dirPath}/course.yaml`);
  const course = yaml.load(fileContents);
  return courseSchema.validateSync(course) as CourseYaml;
}

type UnitYaml = {
  name: string;
  title: string;
  content: { src: string }[];
};

const unitSchema = yup.object().shape({
  name: yup.string().required(),
  title: yup.string().required(),
  content: yup.array().of(
    yup.object().shape({
      src: yup.string().required(),
    })
  ),
});

async function loadUnitYaml(dirPath: string, src: string) {
  const fileContents = await readFile(path.join(dirPath, src));
  const unit = yaml.load(fileContents);
  return unitSchema.validateSync(unit) as UnitYaml;
}
