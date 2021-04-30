type Font = {
  value: string;
  label: string;
};

const fonts: Font[] = [
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

function createFontButton(font: Font) {
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
