import { Item } from './shared';

type ReadabilityItem = Item & {
  min: number;
  max: number;
  increment: number;
};

const options: ReadabilityItem[] = [
  {
    value: 'fontSize',
    label: 'Font-size',
    min: 0.6,
    max: 2,
    increment: 0.1,
  },
  {
    value: 'lineSpacing',
    label: 'Line spacing',
    min: 0.6,
    max: 2,
    increment: 0.1,
  },
  {
    value: 'letterSpacing',
    label: 'Letter spacing',
    min: 0.6,
    max: 2,
    increment: 0.1,
  },
  {
    value: 'lineWidth',
    label: 'Line width',
    min: 0.6,
    max: 2,
    increment: 0.1,
  },
];

export function createReadabilityList() {
  return {
    type: 'element',
    tagName: 'ul',
    properties: {
      id: 'readability',
    },
    children: options.map(createOption),
  };
}

function createOption(item: ReadabilityItem) {
  return {
    type: 'element',
    tagName: 'li',
    properties: {
      className: [item.value],
      'data-min': item.min,
      'data-max': item.max,
      'data-increment': item.increment,
    },
    children: [
      {
        type: 'element',
        tagName: 'span',
        properties: {
          className: ['label'],
        },
        children: [
          {
            type: 'text',
            value: item.label,
          },
        ],
      },
      {
        type: 'element',
        tagName: 'span',
        properties: {
          className: ['actions'],
        },
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['btn', 'minus'],
            },
            children: [
              {
                type: 'text',
                value: '−',
              },
            ],
          },
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['btn', 'plus'],
            },
            children: [
              {
                type: 'text',
                value: '+',
              },
            ],
          },
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['btn', 'reset'],
            },
            children: [
              {
                type: 'text',
                value: 'Reset',
              },
            ],
          },
        ],
      },
    ],
  };
}
