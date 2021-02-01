import marked, { Renderer } from 'marked';
import pretty from 'pretty';
import { codeBlock } from './code-block';
// import sanitizeHtml from 'sanitize-html'

export function renderHtml(markdown: string) {
  const renderer = new Renderer();
  renderer.code = codeBlock;
  marked.use({ renderer });

  const dirty = marked(markdown);
  // const clean = sanitizeHtml(dirty)
  return pretty(dirty);
}
