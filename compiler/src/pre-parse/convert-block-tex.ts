const blockList = ['\\newpage', '\\pagebreak', '\\mbox'];

export function convertNewPageToDirective(contents: string) {
  return contents
    .split('\n')
    .map((s) => (blockList.includes(s.trim()) ? '::pagebreak' : s))
    .join('\n');
}
