import { Item } from './shared';

const fonts: Item[] = [
  {
    value: 'default',
    label: 'Default',
  },
  {
    value: 'serif',
    label: 'Serif',
  },
  {
    value: 'sans-serif',
    label: 'Sans-serif',
  },
  {
    value: 'monospace',
    label: 'Monospace',
  },
];

export function createFontList() {
  return {
    type: 'element',
    tagName: 'ul',
    properties: {
      id: 'fonts',
    },
    children: fonts.map(createFontButton),
  };
}

function createFontButton(font: Item) {
  return {
    type: 'element',
    tagName: 'li',
    properties: {
      className: [font.value],
    },
    children: [
      {
        type: 'text',
        value: font.label,
      },
    ],
  };
}
