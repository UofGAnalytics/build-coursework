export function convertMacroToDirective(contents: string) {
  return contents
    .split('\n')
    .map((line) => {
      const container = parseCustomContainer(line);
      if (container !== null) {
        return renderContainerDirective(container);
      }
      return line;
    })
    .join('\n');
}

type Container = {
  name: string;
  title: string;
  attributes: string;
};

function parseCustomContainer(line: string): Container | null {
  const match = line.match(/^#{1,6}\s*\[(.+)](.*)/);
  if (!Array.isArray(match)) {
    return null;
  }
  const [, attributeStr = '', extra = ''] = match;
  const [name, ...attributesArr] = attributeStr
    .split(',')
    .map((s) => s.trim());
  const title = extra.trim();
  const attributes = transformAttributes(name, attributesArr);
  return { name, title, attributes };
}

function renderContainerDirective({ name, title, attributes }: Container) {
  const colons = getColons(name);
  if (name.startsWith('/')) {
    return colons;
  }
  const newTitle = title ? `[${title}]` : '';
  const newAttributes = attributes ? `{${attributes}}` : '';
  return colons + name + newTitle + newAttributes;
}

function getColons(name: string) {
  switch (name.replace('/', '')) {
    case 'task':
      return '::::';
    case 'video':
      return '::';
    default:
      return ':::';
  }
}

function transformAttributes(
  containerName: string,
  attributesArr: string[]
) {
  return attributesArr
    .map((attribute) => {
      const [key, value] = attribute.split('=').map((s) => s.trim());
      if (containerName === 'video' && key === 'videoid') {
        return `id=${value}`;
      }
      return attribute;
    })
    .join(' ');
}
