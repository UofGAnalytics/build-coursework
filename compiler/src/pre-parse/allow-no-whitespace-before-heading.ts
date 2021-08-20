export function allowNoWhitespaceBeforeHeading(contents: string) {
  return contents
    .split('\n')
    .map((line) => {
      const match = line.match(/^(#+)(\w+)$/);
      if (match !== null) {
        return `${match[1]} ${match[2]}`;
      }
      return line;
    })
    .join('\n');
}
