import { Element, Text } from 'hast';
import { startCase } from 'lodash';
import toHast from 'mdast-util-to-hast';
import { Node, Parent } from 'unist';
import visit from 'unist-util-visit';

interface ContainerDirective extends Parent {
  name: string;
  attributes: Record<string, string>;
}

export function boxouts() {
  return async (tree: Node) => {
    const counter = createCounter();
    visit<ContainerDirective>(tree, 'containerDirective', (node) => {
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
            hProperties: createAttributes(node, count),
            hChildren: createBoxout(node, count),
          };
        }
      }
    });
  };
}

function createAttributes(node: ContainerDirective, count: number) {
  const name = node.name as string;
  const id = `${name}-${count}`;

  const attributes = node.attributes as Record<string, string>;
  const className = ['boxout', name];
  if (attributes.icon) {
    className.push(`${attributes.icon}-icon`);
  }
  return { className, id };
}

export function createBoxout(
  node: ContainerDirective,
  count: number
): Node[] {
  const typeTitle = createBoxoutType(node, count);
  const titles = [typeTitle];

  const titleValue = getTitleValue(node);
  if (titleValue.length > 0) {
    const title = createTitle(node);
    titles.push(title);
  }

  const children = node.children as ContainerDirective[];

  const content = children
    .filter((o) => !o.data?.directiveLabel)
    .filter((o) => o.type !== 'containerDirective' && o.name !== 'answer')
    .map((o) => toHast(o, { allowDangerousHtml: true }))
    .filter(Boolean);

  if (node.name === 'task') {
    const answer = children.find(
      (o) => o.type === 'containerDirective' && o.name === 'answer'
    );
    if (answer) {
      content.push(createAnswer(answer, count));
    }
  }

  return [...titles, ...content];
}

function createAnswer(node: ContainerDirective, count: number) {
  const { children } = toHast(node) as Parent;
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
  count: number
): Element {
  const name = node.name as string;
  const label = startCase(name);
  let value = `${label} ${count}`;

  if (node.attributes.optional !== undefined) {
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
    children: createTitleValue(node) as Element['children'],
  };
}

function createTitleValue(node: ContainerDirective) {
  const name = node.name as string;
  const newRoot = {
    type: 'root',
    children: getTitleValue(node),
  };
  const { children = [] } = toHast(newRoot) as Parent;
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

export type Counter = {
  increment: (key: string) => number;
};

export function createCounter() {
  const store: Record<string, number> = {};
  return {
    increment(key: string) {
      store[key] = (store[key] || 0) + 1;
      return store[key];
    },
  };
}
