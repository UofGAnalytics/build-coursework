type Theme = {
  value: string;
  label: string;
};

const themes: Theme[] = [
  {
    value: 'light',
    label: 'Light',
  },
  {
    value: 'dark',
    label: 'Dark',
  },
  {
    value: 'yellow-on-black',
    label: 'Yellow on Black',
  },
  {
    value: 'black-on-yellow',
    label: 'Black on Yellow',
  },
  {
    value: 'black-on-red',
    label: 'Black on Red',
  },
  {
    value: 'black-on-blue',
    label: 'Black on Blue',
  },
];

export function createThemeList() {
  return {
    type: 'element',
    tagName: 'ul',
    properties: {
      id: 'themes',
    },
    children: themes.map(createThemeButton),
  };
}

function createThemeButton(theme: Theme) {
  return {
    type: 'element',
    tagName: 'li',
    properties: {
      className: [theme.value],
    },
    children: [
      {
        type: 'text',
        value: theme.label,
      },
    ],
  };
}
