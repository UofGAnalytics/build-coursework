const blockList = ['\\newpage', '\\pagebreak'];

export function convertNewPageToDirective(contents: string) {
  return contents
    .split('\n')
    .map((a) => (blockList.some((b) => a.includes(b)) ? '::pagebreak' : a))
    .join('\n');
}

export function convertEmptyMBoxToDirective(contents: string) {
  return contents
    .split('\n')
    .map((line) => {
      if (
        line.includes('\\mbox') &&
        line.replace('{', '').replace('}', '').trim() === '\\mbox'
      ) {
        return '::pagebreak';
      }
      return line;
    })
    .join('\n');
}
