import path from 'path';
import pretty from 'pretty';
import { Course, Unit } from '../coursework-compiler';
import { readFile } from '../util';

export async function compileTemplate(
  course: Course,
  unit: Unit,
  html: string
) {
  if (process.env.NODE_ENV === 'development') {
    return compileHtmlContent(course, unit, html);
  } else {
    return compileHtmlDoc(course, unit, html);
  }
}

async function compileHtmlDoc(course: Course, unit: Unit, html: string) {
  const css = await readFile(path.join(__dirname, 'template/main.css'));
  const js = await readFile(path.join(__dirname, 'template/main.js'));
  const content = compileHtmlContent(course, unit, html);

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

function compileHtmlContent(course: Course, unit: Unit, html: string) {
  return pretty(`
    <h1>${unit.title}</h1>
    <h4>${course.title}: ${unit.name}</h4>
    <main>${html}</main>
  `);
}
