import { Node } from 'unist';

export type CodeParams = {
  language: string;
  options: Record<string, any>;
  value: string;
};

export function parseCodeParams(node: Node): CodeParams {
  const combined = `${node.lang || ''}${node.meta || ''}`;
  const language = parseLanguage(combined);

  // TODO: yup validate options?
  const options = parseOptions(combined);
  const value = String(node.value || '').trim();

  return { language, options, value };
}

function parseLanguage(options: string) {
  const trimmed = options.trim();
  if (trimmed[0] === '{') {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((s) => s.trim())[0];
  }
  return trimmed.toLowerCase();
}

function parseOptions(options: string) {
  const trimmed = options.trim();

  if (trimmed[0] !== '{') {
    return {};
  }

  return trimmed
    .slice(1, -1)
    .split(',')
    .slice(1)
    .reduce((acc: CodeParams['options'], str) => {
      const [key, value] = str.split('=').map((s) => s.trim());
      acc[key] = parseOptionValue(value);
      return acc;
    }, {});
}

function parseOptionValue(mixed: string | undefined) {
  if (mixed === 'TRUE' || mixed === undefined) {
    return true;
  }
  if (mixed === 'FALSE') {
    return false;
  }
  if (!Number.isNaN(Number(mixed))) {
    return Number(mixed);
  }
  if (mixed[0] === "'" && mixed[mixed.length - 1] === "'") {
    return mixed.slice(1, -1);
  }
  if (mixed[0] === '"' && mixed[mixed.length - 1] === '"') {
    return mixed.slice(1, -1);
  }
  return mixed;
}
