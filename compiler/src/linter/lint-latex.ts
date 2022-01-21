import { exec } from 'child_process';

import { Literal } from 'mdast';
import { Node, Position } from 'unist';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

export function lintLatex() {
  return async (tree: Node, file: VFile) => {
    const transformations: Promise<void>[] = [];

    visit<Literal>(tree, 'math', (node) => {
      transformations.push(chktex(node, file));
    });

    await Promise.all(transformations);
    return tree;
  };
}

async function chktex(node: Literal, file: VFile) {
  return new Promise<void>((resolve, reject) => {
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

  function formatMessage(message: string) {
    return message.replace(/'/g, '').replace(/`/g, '');
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
        const message = formatMessage(match[1]);
        acc.push({
          line,
          column: match[3].length,
          message: `${message}\n\n${match[2]}\n${match[3]}^`,
        });
      } else {
        acc.push({
          line,
          column: 0,
          message: formatMessage(trimmed),
        });
      }

      return acc;
    }, []);
}
