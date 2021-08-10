// @ts-expect-error
import markdownTable from 'markdown-table';

export function reformatPandocSimpleTables(contents: string) {
  const lines = contents.split('\n');

  // operate on array backwards as length may change with transformation,
  // preserving index in loop
  for (var idx = lines.length - 1; idx >= 0; idx--) {
    const line = lines[idx];

    if (isValidPandocSimpleTableSeparator(line, idx)) {
      const { startIdx, count } = getTableBounds(lines, idx);
      const currentLines = lines.slice(startIdx, startIdx + count + 1);
      const newLines = convertLines(currentLines);
      lines.splice(startIdx, count, ...newLines);
    }
  }

  return lines.join('\n');
}

function isValidPandocSimpleTableSeparator(line: string, idx: number) {
  if (idx === 0 || !/-{2,}/g.test(line) || !/^[\s|-]+$/.test(line)) {
    return false;
  }
  return getColumnIndexes(line).length > 1;
}

function convertLines(lines: string[]) {
  const table = parseTable(lines);
  const align = getColumnAlignment(table[0]);
  return markdownTable(table, { align }).split('\n');
}

function getTableBounds(arr: string[], idx: number) {
  const startIdx = idx - 1;
  const endIdx = arr.slice(startIdx).findIndex((l) => l.trim() === '');
  const count = endIdx === -1 ? arr.length - 1 : endIdx;
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
