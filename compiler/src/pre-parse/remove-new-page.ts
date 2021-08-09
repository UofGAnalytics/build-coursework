const blockList = ['\\newpage', '\\pagebreak'];

export function removeNewPage(contents: string) {
  return contents
    .split('\n')
    .filter((s) => !blockList.includes(s.trim()))
    .join('\n');
}
