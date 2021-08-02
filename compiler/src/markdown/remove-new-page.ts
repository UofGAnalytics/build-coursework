export function removeNewPage(contents: string) {
  return contents
    .split('\n')
    .filter((s) => s.trim() !== '\\newpage')
    .join('\n');
}
