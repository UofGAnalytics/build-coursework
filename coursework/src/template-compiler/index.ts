import path from 'path';
import pretty from 'pretty';
import { Course } from '../coursework-compiler';
import { readFile } from '../util';
import { renderHtml } from '../markdown-parser';

export async function compileTemplate(course: Course, unitIdx: number) {
  if (process.env.NODE_ENV === 'development') {
    return compileContent(course, unitIdx);
  } else {
    return compileWholeHtmlDoc(course, unitIdx);
  }
}

function compileContent(course: Course, unitIdx: number) {
  const unit = course.units[unitIdx];
  const html = unit.markdown.map(renderHtml).join('\n');

  return pretty(`
    <h1>${unit.title}</h1>
    <h4>${course.title}: Unit ${unitIdx + 1}</h4>
    <main>${html}</main>
  `);
}

async function compileWholeHtmlDoc(course: Course, unitIdx: number) {
  const css = await readFile(path.join(__dirname, 'template/main.css'));
  const js = await readFile(path.join(__dirname, 'template/main.js'));
  const content = compileContent(course, unitIdx);

  return pretty(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>University of Glasgow</title>
        <style>${css}</style>
      </head>
      <body>
        <div class="wrapper">${content}</div>
        <script>${js}</script>
      </body>
    </html>
  `);
}
