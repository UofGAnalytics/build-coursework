import marked, { Renderer } from 'marked';
import pretty from 'pretty';
import { codeBlock } from './code-block';
// import sanitizeHtml from 'sanitize-html'

export function renderHtml(dirPath: string, markdown: string) {
  const renderer = new Renderer();
  renderer.code = codeBlock(dirPath);
  marked.use({ renderer });

  const dirty = marked(markdown);
  // const clean = sanitizeHtml(dirty)
  return pretty(dirty);
}
