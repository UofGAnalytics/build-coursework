import {
  Element,
  ElementContent,
  Parent as HastParent,
  Text,
  Node,
} from 'hast';
import startCase from 'lodash/startCase.js';
import { Root } from 'mdast';
import { ContainerDirective } from 'mdast-util-directive';
import { toHast } from 'mdast-util-to-hast';
import { Parent } from 'unist';
import { visit } from 'unist-util-visit';

import { Context } from '../context';
import { createCounter } from '../utils/counter';

export function boxouts(refStore: Context['refStore']) {
  const counter = createCounter();
  return async (tree: Node) => {
    visit(tree, 'containerDirective', (node: ContainerDirective) => {
      switch (node.name) {
        case 'example':
        case 'error':
        case 'supplement':
        case 'background':
        case 'definition':
        case 'weblink':
        case 'theorem':
        case 'task':
        case 'proposition':
        case 'answer': {
          const name = node.name as string;
          const count = counter.increment(name);
          node.data = {
            hProperties: createAttributes(node, count, refStore),
            hChildren: createBoxout(node, count) as any,
          };
        }
      }
    });
  };
}

function createAttributes(
  node: ContainerDirective,
  count: number,
  refStore: Context['refStore'],
) {
  const name = node.name as string;
  const id = `${name}-${count}`;

  const attributes = node.attributes as Record<string, string>;
  const className = ['boxout', name];
  if (attributes.icon) {
    className.push(`${attributes.icon}-icon`);
  }

  if (
    node.attributes?.label !== undefined &&
    node.attributes?.label !== null
  ) {
    refStore[node.attributes.label] = id;
  }

  return { className, id };
}

export function createBoxout(
  node: ContainerDirective,
  count: number,
): Node[] {
  const typeTitle = createBoxoutType(node, count);
  const titles = [typeTitle];

  const titleValue = getTitleValue(node);
  if (titleValue.length > 0) {
    const title = createTitle(node);
    titles.push(title);
  }

  const content = node.children
    // @ts-expect-error
    .filter((o) => !o.data?.directiveLabel)
    .filter((o) => (o as ContainerDirective).name !== 'answer')

    .map((o) => toHast(o, { allowDangerousHtml: true }))
    .filter(Boolean) as HastParent[];

  if (node.name === 'task') {
    const answer = node.children.find(
      (o) => o.type === 'containerDirective' && o.name === 'answer',
    );
    if (answer) {
      const answerHast = createAnswer(answer as ContainerDirective, count);
      content.push(answerHast as HastParent);
    }
  }

  return [...titles, ...content];
}

function createAnswer(node: ContainerDirective, count: number) {
  const { children } = toHast(node) as HastParent;
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: ['answer'],
    },
    children: [
      {
        type: 'element',
        tagName: 'span',
        properties: {
          className: ['answer-trigger'],
          'data-answer-id': count,
        },
        children: [
          {
            type: 'text',
            value: 'Show answer',
          },
        ],
      },
      {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['answer-reveal'],
          id: `answer-${count}`,
        },
        children,
      },
    ],
  };
}

function createBoxoutType(
  node: ContainerDirective,
  count: number,
): Element {
  const name = node.name as string;
  const label = startCase(name);
  let value = `${label} ${count}`;

  if (node.attributes?.optional !== undefined) {
    value += ` (Optional)`;
  }

  return {
    type: 'element',
    tagName: 'span',
    properties: {
      className: ['type'],
    },
    children: [
      {
        type: 'text',
        value,
      },
    ],
  };
}

function createTitle(node: ContainerDirective): Element {
  return {
    type: 'element',
    tagName: 'h3',
    children: createTitleValue(node) as ElementContent[],
    properties: {},
  };
}

function createTitleValue(node: ContainerDirective) {
  const name = node.name as string;
  const newRoot = {
    type: 'root',
    children: getTitleValue(node),
  };
  const { children = [] } = toHast(newRoot as Root) as Parent;
  if (name !== 'weblink') {
    return children;
  }
  const { target } = node.attributes as Record<string, string>;
  return [
    {
      type: 'element',
      tagName: 'a',
      properties: {
        href: target,
        target: '_blank',
        className: ['target'],
      },
      children,
    },
  ];
}

function getTitleValue(node: ContainerDirective): Node[] {
  const children = (node.children || []) as Node[];
  const parent = (children[0] || {}) as Parent;

  // @ts-expect-error
  if (!parent.data?.directiveLabel) {
    if (node.name === 'weblink') {
      const attributes = node.attributes as Record<string, string>;
      return [
        {
          type: 'text',
          value: attributes.target,
        } as Text,
      ];
    }
    return [];
  }

  return parent.children || [];
}
