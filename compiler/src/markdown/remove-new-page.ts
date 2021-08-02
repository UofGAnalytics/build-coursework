import { EOL } from 'os';

export function removeNewPage(contents: string) {
  return contents
    .split(EOL)
    .filter((s) => s.trim() !== '\\newpage')
    .join(EOL);
}
