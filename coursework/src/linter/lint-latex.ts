import visit from 'unist-util-visit';
import { Node, Position } from 'unist';
import { VFile } from 'vfile';
import { exec } from 'child_process';
import { reject } from 'lodash';
// import escapeLatex from 'escape-latex';

export function lintLatex() {
  return async (tree: Node, file: VFile) => {
    const transformations: Promise<void>[] = [];

    visit(tree, 'math', (node) => {
      transformations.push(chktex(node, file));
    });

    await Promise.all(transformations);

    return tree;
  };
}

async function chktex(node: Node, file: VFile) {
  return new Promise<void>((resolve) => {
    exec(`chktex -q <<< "${node.value}"`, (err, response) => {
      if (err) {
        reject(err);
      } else {
        const messages = formatResponse(response);
        const position = node.position as Position;
        messages.forEach(({ line, column, message }) => {
          file.message(message, {
            line: position.start.line + line,
            column: position.start.column + column,
          });
        });
        resolve();
      }
    });
  });
}

type Message = {
  line: number;
  column: number;
  message: string;
};

function formatResponse(response: string) {
  if (response.trim() === '') {
    return [];
  }
  return response
    .split(/Warning \d+ in stdin line /)
    .filter(Boolean)
    .reduce((acc: Message[], s) => {
      const [key, value] = s.split(':');
      const line = Number(key);
      const trimmed = value.trim();

      const match = trimmed.match(/(.*)\n(.*)\n(\s*)\^/m);
      if (Array.isArray(match)) {
        const message = match[1].replace(/'/g, '').replace(/`/g, '');
        acc.push({
          line,
          column: match[3].length,
          message: `${message}\n\n${match[2]}\n${match[3]}^`,
        });
      } else {
        acc.push({
          line,
          column: 0,
          message: trimmed.replace(/'/g, '').replace(/`/g, ''),
        });
      }

      return acc;
    }, []);
}
