// @ts-expect-error
import markdownTable from 'markdown-table';

export function reformatPandocSimpleTables(contents: string) {
  const lines = contents.split('\n');

  for (var idx = lines.length - 1; idx >= 0; idx--) {
    const line = lines[idx];

    if (isValidPandocSimpleTableSeparator(line, idx, lines)) {
      const bounds = getTableBounds(lines, idx);
      const tableLines = lines.slice(
        bounds.startIdx,
        bounds.startIdx + bounds.count
      );
      const table = parseTable(tableLines);
      const align = getColumnAlignment(table[0]);
      const mdTable = markdownTable(table, { align });

      lines.splice(bounds.startIdx, bounds.count, ...mdTable.split('\n'));
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
  // const titles = parseBodyRow(arr[idx - 1], columnIndexes);
  // const filtered = titles.filter((s) => s.trim() !== '');
  return columnIndexes.length > 1;
}

function getTableBounds(arr: string[], idx: number) {
  const startIdx = idx - 1;
  const count = arr.slice(startIdx).findIndex((l) => l.trim() === '');
  return { startIdx, count };
}

function parseTable(tableLines: string[]) {
  const [titles, separator, ...body] = tableLines;
  const columnIndexes = getColumnIndexes(separator);
  const titleCells = parseTitleRow(titles, columnIndexes);
  const bodyCells = body
    .map((line) => parseBodyRow(line, columnIndexes))
    .reduce(multilineReducer, []);
  return [titleCells, ...bodyCells];
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

function getColumnAlignment(titleCells: string[]): string[] {
  return titleCells.map((title) => {
    if (title[0] === ' ') {
      if (title[title.length - 1] === ' ') {
        return 'center';
      }
      return 'right';
    }
    return 'left';
  });
}

function parseTitleRow(line: string, columnIndexes: number[][]) {
  return columnIndexes.map((tuple) => line.slice(...tuple));
}

function parseBodyRow(line: string, columnIndexes: number[][]) {
  return columnIndexes.map((tuple) => {
    const end = tuple[1] === undefined ? tuple[1] : tuple[1] + 1;
    return line.slice(tuple[0], end).trim();
  });
}

function multilineReducer(acc: string[][], row: string[]) {
  if (row.some((cell) => cell.trim() === '')) {
    const prevIdx = acc.length - 1;
    acc[prevIdx].forEach((cell, i) => {
      const trimmed = row[i].trim();
      if (trimmed !== '') {
        acc[prevIdx][i] = cell + ' ' + trimmed;
      }
    });
  } else {
    acc.push(row);
  }
  return acc;
}
