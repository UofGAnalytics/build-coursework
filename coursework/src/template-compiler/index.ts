import { templateSettings } from 'lodash';
import pretty from 'pretty';
import { CourseWork } from '../coursework-compiler';

templateSettings.interpolate = /{{([\s\S]+?)}}/g;

export async function compileTemplate(coursework: CourseWork) {
  const [unit] = coursework.units;

  return pretty(`
    <h1>${unit.title}</h1>
    <div class="subtitle">${coursework.title}: ${unit.name}</div>
    <main>${unit.html.join('\n')}</main>
  `);
}
