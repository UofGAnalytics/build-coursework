type Item = {
  value: string;
  label: string;
};

const options: Item[] = [
  {
    value: 'font-size',
    label: 'Font-size',
  },
  {
    value: 'line-spacing',
    label: 'Line spacing',
  },
  {
    value: 'letter-spacing',
    label: 'Letter spacing',
  },
  {
    value: 'line-width',
    label: 'Line width',
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

function createOption(item: Item) {
  return {
    type: 'element',
    tagName: 'li',
    properties: {
      className: [item.value],
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
