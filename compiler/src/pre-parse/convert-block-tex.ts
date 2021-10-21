const blockList = ['\\newpage', '\\pagebreak', '\\mbox'];

export function convertNewPageToDirective(contents: string) {
  return contents
    .split('\n')
    .map((a) => (blockList.some((b) => a.includes(b)) ? '::pagebreak' : a))
    .join('\n');
}
