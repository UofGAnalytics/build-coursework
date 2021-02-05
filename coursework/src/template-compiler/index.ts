import path from 'path';
import pretty from 'pretty';
import { Course } from '../coursework-compiler';
import { readFile } from '../util';
import { renderHtml } from '../markdown-parser';

export async function compileTemplate(course: Course, unitIdx: number) {
  if (process.env.NODE_ENV === 'development') {
    return compileHtmlContent(course, unitIdx);
  } else {
    return compileHtmlDoc(course, unitIdx);
  }
}

function compileHtmlContent(course: Course, unitIdx: number) {
  const unit = course.units[unitIdx];
  const html = unit.markdown.map(renderHtml).join('\n');

  return pretty(`
    <h1>${unit.title}</h1>
    <h4>${course.title}: Unit ${unitIdx + 1}</h4>
    <main>${html}</main>
  `);
}

async function compileHtmlDoc(course: Course, unitIdx: number) {
  const css = await readFile(path.join(__dirname, 'template/main.css'));
  const js = await readFile(path.join(__dirname, 'template/main.js'));
  const content = compileHtmlContent(course, unitIdx);

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
        <script type="text/javascript" id="MathJax-script" async
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js">
        </script>
      </body>
    </html>
  `);
}
