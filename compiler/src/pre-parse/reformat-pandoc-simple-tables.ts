import { EOL } from 'os';

import { markdownTable } from 'markdown-table';

export function reformatPandocSimpleTables(contents: string) {
  const lines = contents.split(EOL);

  // operate on array backwards as length may change with transformation,
  // preserving index in loop
  for (var idx = lines.length - 1; idx >= 0; idx--) {
    if (isValidPandocSimpleTableSeparator(lines, idx)) {
      const { startIdx, count } = getTableBounds(lines, idx);
      const currentLines = lines.slice(startIdx, startIdx + count + 1);
      const newLines = convertLines(currentLines);
      lines.splice(startIdx, count + 1, ...newLines, '');
    }
  }

  return lines.join(EOL);
}

function isValidPandocSimpleTableSeparator(
  lines: string[],
  idx: number,
  isEnd?: boolean
) {
  const line = lines[idx] || '';

  if (idx === 0 || !/-{2,}/g.test(line) || !/^[\s|-]+$/.test(line)) {
    return false;
  }
  if (getColumnIndexes(line).length <= 1) {
    return false;
  }
  if (!isEnd) {
    const nextLine = lines[idx + 1] || '';
    if (nextLine.trim() === '') {
      return false;
    }
  }

  return true;
}

function getTableBounds(arr: string[], idx: number) {
  const startIdx = idx - 1;
  const endIdx = arr.slice(startIdx).findIndex((l) => l.trim() === '');
  const count = endIdx === -1 ? arr.length - 1 : endIdx;
  return { startIdx, count };
}

function convertLines(lines: string[]) {
  const table = parseTable(lines);
  const align = getColumnAlignment(table[0]);
  const result = markdownTable(table, { align });
  return result.split(EOL);
}

function parseTable(lines: string[]) {
  const [titles, separator, ...body] = lines;
  const columnIndexes = getColumnIndexes(separator);
  const titleCells = parseTitleRow(titles, columnIndexes);
  const rows = body.map((line) => parseBodyRow(line, columnIndexes));
  const endSeparatorIdx = getEndSeparatorIdx(body);

  if (endSeparatorIdx !== -1) {
    return [titleCells, ...rows.slice(0, endSeparatorIdx)];
  }
  const multilineRows = rows.reduce(multilineReducer, []);
  return [titleCells, ...multilineRows];
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

function getEndSeparatorIdx(lines: string[]) {
  for (let idx = lines.length - 1; idx > 0; idx--) {
    const line = lines[idx];
    if (line.trim() !== '') {
      if (isValidPandocSimpleTableSeparator(lines, idx, true)) {
        return idx;
      } else {
        return -1;
      }
    }
  }
  return -1;
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
    acc.push(row.slice());
  }
  return acc;
}
