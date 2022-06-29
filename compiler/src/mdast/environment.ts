import startCase from 'lodash/startCase.js';
import { ContainerDirective } from 'mdast-util-directive';
import { toHast } from 'mdast-util-to-hast';
import { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

const platforms = ['mac', 'windows', 'linux'];
const programs = ['cli', 'github-desktop'];

export function environment() {
  // const defaultPlatform = platforms[0];
  // const defaultProgram = programs[0];

  return async (tree: Node) => {
    visit(tree, 'containerDirective', (node: ContainerDirective) => {
      if (node.name === 'environment') {
        node.data = createEnvironmentConfig(node);
      } else if (platforms.includes(node.name)) {
        node.data = {
          hProperties: {
            className: ['platform', node.name],
          },
        };
      } else if (programs.includes(node.name)) {
        node.data = {
          hProperties: {
            className: ['program', node.name],
          },
        };
      }
    });
  };
}

function createEnvironmentConfig(node: Parent) {
  const hName = 'div';

  const hProperties = {
    id: 'environment',
    className: 'boxout',
  };

  const hChildren = [
    {
      type: 'element',
      tagName: 'span',
      properties: {
        className: ['type'],
      },
      children: [
        {
          type: 'text',
          value: 'Environment',
        },
      ],
    },
    ...node.children.map((node) => toHast(node as any)),
    {
      type: 'element',
      tagName: 'div',
      properties: {
        id: 'platforms',
      },
      children: [
        {
          type: 'element',
          tagName: 'h3',
          children: [
            {
              type: 'text',
              value: 'Platform',
            },
          ],
        },
        ...platforms.map((platform, idx) => {
          return createRadioInput('platform', platform, idx);
        }),
      ],
    },
    {
      type: 'element',
      tagName: 'div',
      properties: {
        id: 'programs',
      },
      children: [
        {
          type: 'element',
          tagName: 'h3',
          children: [
            {
              type: 'text',
              value: 'Program',
            },
          ],
        },
        ...programs.map((program, idx) => {
          return createRadioInput('program', program, idx);
        }),
      ],
    },
  ];

  return {
    hName,
    hProperties,
    hChildren,
  };
}

function createRadioInput(name: string, value: string, idx: number) {
  return {
    type: 'element',
    tagName: 'label',
    properties: {
      [`data-${name}`]: value,
    },
    children: [
      {
        type: 'element',
        tagName: 'input',
        properties: {
          type: 'radio',
          name,
          value,
          checked: idx === 0,
        },
        children: [],
      },
      {
        type: 'element',
        tagName: 'span',
        children: [
          {
            type: 'text',
            value: startCase(value),
          },
        ],
      },
    ],
  };
}
