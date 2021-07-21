export function formatBlockMath(contents: string) {
  return contents
    .split('\n')
    .reduce((acc: string[], line) => {
      if (/[\S]\$\$/g.test(line)) {
        acc.push(...expandToLines(line));
      } else {
        acc.push(line);
      }
      return acc;
    }, [])
    .join('\n');
}

function expandToLines(line: string) {
  const result = line
    .split('$$')
    .map((s) => s.trim())
    .reduce((acc: string[], segment, idx) => {
      if (idx === 0) {
        acc.push(segment);
      } else if (idx % 2 !== 0) {
        acc.push('', '$$', segment, '$$', '');
      }
      return acc;
    }, []);

  const trimmed = result.join('\n').trim();

  // console.log('------------');
  // console.log(trimmed);

  return trimmed.split('\n');
}
