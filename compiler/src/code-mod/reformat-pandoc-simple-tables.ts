// @ts-expect-error
import markdownTable from 'markdown-table';

export function reformatPandocSimpleTables(contents: string) {
  let lines = contents.split('\n');

  for (var idx = lines.length - 1; idx >= 0; idx--) {
    const line = lines[idx];

    if (isValidPandocSimpleTableSeparator(line, idx, lines)) {
      const bounds = getTableBounds(lines, idx);
      const tableLines = lines.slice(bounds.startIdx, idx + bounds.count);
      const { table, align } = parseTable(tableLines);
      const mdTable = markdownTable(table, { align });

      lines.splice(
        bounds.startIdx,
        bounds.count + 1,
        ...mdTable.split('\n')
      );
    }
  }

  return lines.join('\n');
}

function isValidPandocSimpleTableSeparator(
  line: string,
  idx: number,
  arr: string[]
) {
  if (idx === 0 || !/-{2,}/g.test(line) || !/^[\s|-]+$/.test(line)) {
    return false;
  }
  const columnIndexes = getColumnIndexes(line);
  const titles = parseBodyRow(arr[idx - 1], columnIndexes).filter(
    (s) => s.trim() !== ''
  );
  return columnIndexes.length === titles.length;
}

function getTableBounds(arr: string[], idx: number) {
  const startIdx = idx - 1;
  const count = arr.slice(idx).findIndex((l) => l.trim() === '');
  return { startIdx, count };
}

function parseTable(tableLines: string[]) {
  const [titles, separator, ...body] = tableLines;
  const columnIndexes = getColumnIndexes(separator);
  const align = getColumnAlignment(titles, columnIndexes);
  const titleCells = parseBodyRow(titles, columnIndexes);
  const bodyCells = body
    .map((line) => parseBodyRow(line, columnIndexes))
    .reduce(multilineReducer, []);
  const table = [titleCells, ...bodyCells];

  return { table, align };
}

function getColumnIndexes(line: string) {
  return line.split('').reduce((acc: number[][], str, idx) => {
    if (str === '-' && (idx === 0 || line[idx - 1] === ' ')) {
      acc.push([idx]);
    } else if (
      idx !== line.length - 1 &&
      str === ' ' &&
      line[idx - 1] === '-'
    ) {
      acc[acc.length - 1].push(idx);
    }
    return acc;
  }, []);
}

function getColumnAlignment(
  line: string,
  columnIndexes: number[][]
): ('left' | 'right' | 'center')[] {
  return columnIndexes
    .map((tuple) => line.slice(...tuple))
    .map((title) => {
      if (title[0] === ' ') {
        if (title[title.length - 1] === ' ') {
          return 'center';
        }
        return 'right';
      }
      return 'left';
    });
}

function parseBodyRow(line: string, columnIndexes: number[][]) {
  return columnIndexes.map((t) => {
    const end = t[1] === undefined ? t[1] : t[1] + 1;
    return line.slice(t[0], end).trim();
  });
}

function multilineReducer(acc: string[][], row: string[]) {
  if (row.some((c) => c.trim() === '')) {
    const prevIdx = acc.length - 1;
    acc[prevIdx].forEach((c, i) => {
      const trimmed = row[i].trim();
      if (trimmed !== '') {
        acc[prevIdx][i] = c + ' ' + trimmed;
      }
    });
  } else {
    acc.push(row);
  }
  return acc;
}
