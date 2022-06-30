import { Element, Literal } from 'hast';
import startCase from 'lodash/startCase.js';
import { ContainerDirective } from 'mdast-util-directive';
import { toHast } from 'mdast-util-to-hast';
import { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

import { Context } from '../context';

const platforms = ['mac', 'windows', 'linux'];
const programs = ['cli', 'github-desktop'];

export function environment(ctx: Context, targetPdf?: boolean) {
  const platformFlag = ctx.options.envPlatform;
  if (platformFlag !== undefined && !platforms.includes(platformFlag)) {
    throw new Error(
      `[environment]: envPlatform ${platformFlag} should be one of ${platforms}`
    );
  }

  const programFlag = ctx.options.envProgram;
  if (programFlag !== undefined && !programs.includes(programFlag)) {
    throw new Error(
      `[environment]: envProgram ${programFlag} should be one of ${programs}`
    );
  }

  return async (tree: Node) => {
    visit(
      tree,
      'containerDirective',
      (node: ContainerDirective, _index, _parent) => {
        const index = _index as number;
        const parent = _parent as Parent;

        if (node.name === 'environment') {
          if (targetPdf || (platformFlag && programFlag)) {
            removeNode(parent, index);
          } else {
            createEnvironmentConfig(node, platformFlag, programFlag);
          }
        }
      }
    );

    visit(
      tree,
      'containerDirective',
      (node: ContainerDirective, _index, _parent) => {
        const index = _index as number;
        const parent = _parent as Parent;

        if (platforms.includes(node.name)) {
          node.data = {
            hProperties: {
              className: [
                'platform',
                node.name,
                platformFlag === node.name ? 'show' : '',
              ],
            },
          };
          if (platformFlag && platformFlag !== node.name) {
            removeNode(parent, index);
          }
        }
      },
      true
    );

    visit(
      tree,
      'containerDirective',
      (node: ContainerDirective, _index, _parent) => {
        const index = _index as number;
        const parent = _parent as Parent;

        if (programs.includes(node.name)) {
          node.data = {
            hProperties: {
              className: [
                'program',
                node.name,
                programFlag === node.name ? 'show' : '',
              ],
            },
          };
          if (programFlag && programFlag !== node.name) {
            removeNode(parent, index);
          }
        }
      },
      true
    );
  };
}

function removeNode(parent: Parent, index: number) {
  const parentChildren = parent?.children || [];
  parentChildren.splice(index || 0, 1);
}

type HastNode = Element | Literal;

function createEnvironmentConfig(
  node: Parent,
  platformFlag?: string,
  programFlag?: string
) {
  const hName = 'div';

  const hProperties = {
    id: 'environment',
    className: 'boxout',
  };

  const hChildren: HastNode[] = [
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
    ...node.children.map((node) => toHast(node as any) as HastNode),
  ];

  if (!platformFlag) {
    hChildren.push({
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
    });
  }

  if (!programFlag) {
    hChildren.push({
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
    });
  }

  node.data = {
    hName,
    hProperties,
    hChildren,
  };
}

function createRadioInput(
  name: string,
  value: string,
  idx: number
): Element {
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
