import { Node } from 'unist';

// import { createFontList } from './font';
import { createReadabilityList } from './readability';
import { createThemeList } from './theme';

export function createViewOptionsButton() {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      id: 'view-options-toggle',
    },
    children: [
      {
        type: 'text',
        value: 'View options',
      },
    ],
  };
}

export function createViewOptions(): Node[] {
  return [
    createTitle('Theme'),
    createThemeList(),
    // createTitle('Font'),
    // createFontList(),
    createTitle('Readability'),
    createReadabilityList(),
  ];
}

function createTitle(value: string) {
  return {
    type: 'element',
    tagName: 'h3',
    children: [
      {
        type: 'text',
        value,
      },
    ],
  };
}
