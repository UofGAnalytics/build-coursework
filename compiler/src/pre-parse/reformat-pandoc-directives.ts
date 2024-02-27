import { EOL } from 'os';
import { parseAttributes } from '../utils/parse-attributes';
import { boxoutAllowList } from '../utils/boxout-allow-list';

export function reformatPandocDirectives(contents: string) {
  return contents
    .split(EOL)
    .map((line) => {
      if (line.startsWith(':::') && line.length > 3) {
        const match = line.match(/^:::\s(.+)$/);
        if (match !== null) {
          const str = match[1];
          if (str.startsWith('{') && str.endsWith('}')) {
            const { id, classes } = parseAttributes(str.slice(1, -1));
            const boxoutName = classes.find((s) =>
              boxoutAllowList.includes(s),
            );
            if (boxoutName) {
              const newId = id ? `#${id}` : '';
              const newClasses = classes
                .filter((s) => s !== boxoutName)
                .map((s) => `.${s}`)
                .join('');
              const attributes = `${newId} ${newClasses}`.trim();
              const newAttributes = attributes ? `{${attributes}}` : '';
              return `:::${boxoutName + newAttributes}`;
            }
          }
          return `:::${str}`;
        }
      }
      return line;
    })
    .join(EOL);
}
