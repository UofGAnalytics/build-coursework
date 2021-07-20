export function formatBlockMath(contents: string) {
  const result = contents
    .split('\n')
    .reduce((acc: string[], line) => {
      const match = line.match(/[\S]\$\$/g);

      if (match === null) {
        acc.push(line);
        return acc;
      }

      const newLines = line
        .split('$$')
        .map((s) => s.trim())
        .reduce((acc2: string[], l, idx) => {
          if (l.trim() === '') {
            return acc2;
          }

          if (idx === 0) {
            acc2.push(l);
            return acc2;
          }

          if (idx % 2 !== 0) {
            acc2.push('', '$$', l, '$$', '');
          }

          return acc2;
        }, []);

      const trimmed = newLines.join('\n').trim();
      acc.push(...trimmed.split('\n'));
      return acc;
    }, [])
    .join('\n');

  return result;
}
