export type CodeParams = {
  language: string;
  options: Record<string, any>;
};

export function parseCodeParams(
  params: string | undefined = ''
): CodeParams {
  return {
    language: parseLanguage(params),
    options: parseOptions(params),
  };
}

function parseLanguage(options: string) {
  const trimmed = options.trim();
  if (trimmed[0] === '{') {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((s) => s.trim())[0];
  }
  return trimmed;
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
  return mixed;
}