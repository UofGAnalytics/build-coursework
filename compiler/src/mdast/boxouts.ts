import {
  Element,
  ElementContent,
  Parent as HastParent,
  Text,
  Node,
} from 'hast';
import startCase from 'lodash/startCase.js';
import { Paragraph, Parent as MdastParent, Root, Literal } from 'mdast';
import { ContainerDirective } from 'mdast-util-directive';
import { toHast } from 'mdast-util-to-hast';
import { Parent } from 'unist';
import { visit } from 'unist-util-visit';

import { Context } from '../context';
import { createCounter } from '../utils/counter';
import { boxoutAllowList } from '../utils/boxout-allow-list';

export function boxouts(refStore: Context['refStore']) {
  const counter = createCounter();
  return async (tree: Node) => {
    visit(tree, 'containerDirective', (node: ContainerDirective) => {
      const name = node.name.trim();
      if (boxoutAllowList.includes(name)) {
        const count = counter.increment(name);
        node.data = {
          hProperties: createAttributes(node, count, refStore),
          hChildren: createBoxout(node, count) as any,
        };
      }
    });
  };
}

function createAttributes(
  node: ContainerDirective,
  count: number,
  refStore: Context['refStore'],
) {
  const name = node.name.trim();
  const id = node.attributes?.id || `${name}-${count}`;

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
  const titles = [];
  const content = [];
  const children = node.children as Paragraph[];

  if (hasPandocCounterFormatting(node)) {
    const typeTitle = createBoxoutTypeFromPandoc(node);
    titles.push(typeTitle);

    const titleValue = getTitleValueFromPandoc(node);
    if (titleValue.length > 0) {
      const title = createTitleFromPandoc(node);
      titles.push(title);
      removeTitleFormattingFromPandoc(children);
    } else {
      removeNameFormattingFromPandoc(children);
    }
  } else {
    const typeTitle = createBoxoutType(node, count);
    titles.push(typeTitle);

    const titleValue = getTitleValue(node);
    if (titleValue.length > 0) {
      const title = createTitle(node);
      titles.push(title);
    }
  }

  content.push(
    ...children
      .filter((o) => !o.data?.directiveLabel)
      .filter((o) => {
        // @ts-expect-error
        return o.type !== 'containerDirective' && o.name !== 'answer';
      })
      .map((o) => toHast(o, { allowDangerousHtml: true }))
      .filter(Boolean),
  );

  if (node.name === 'task') {
    const answer = children.find(
      // @ts-expect-error
      (o) => o.type === 'containerDirective' && o.name === 'answer',
    ) as unknown as ContainerDirective | undefined;

    if (answer) {
      const answerHast = createAnswer(answer, count);
      content.push(answerHast as HastParent);
    }
  }

  return [...titles, ...content];
}

function createBoxoutType(
  node: ContainerDirective,
  count: number,
): Element {
  const name = node.name.trim();
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

function hasPandocCounterFormatting(node: ContainerDirective) {
  if (!node.children || node.children.length === 0) {
    return false;
  }
  const content = node.children[0] as Paragraph;
  const counter = content.children[0] as Parent;

  let hasCounter = false;
  if (counter.children) {
    const counterText = counter.children[0] as Literal;
    hasCounter = /\d+$/.test(counterText.value);
  }

  const counterValue = content.children[1];

  return (
    counter.type === 'strong' &&
    hasCounter &&
    counterValue?.type === 'text' &&
    (counterValue?.value.startsWith('. ') ||
      /^\s\((.+)\)\./.test(counterValue?.value))
  );
}

function removeTitleFormattingFromPandoc(children: Paragraph[]) {
  children[0].children = children[0].children.slice(1);
  const p1 = children[0].children[0] as Literal;
  p1.value = p1.value.slice(p1.value.indexOf('). ') + 3);
}

function removeNameFormattingFromPandoc(children: Paragraph[]) {
  children[0].children = children[0].children.slice(1);
  const p1 = children[0].children[0] as Literal;
  p1.value = p1.value.slice(2);
}

function createBoxoutTypeFromPandoc(node: ContainerDirective) {
  const content = node.children as Paragraph[];
  const strong = content[0].children[0] as MdastParent;
  const title = strong.children[0] as Literal;
  return {
    type: 'element',
    tagName: 'span',
    properties: {
      className: ['type'],
    },
    children: [
      {
        type: 'text',
        value: title.value,
      },
    ],
  };
}

function getTitleValueFromPandoc(node: ContainerDirective): Literal[] {
  const content = node.children[0] as Paragraph;
  const counter = content.children[1] as Literal;
  const counterValue = counter?.value || '';
  const match = counterValue.match(/^\s\((.+)\)\./);

  if (match === null) {
    return [];
  }

  return [
    {
      type: 'text',
      value: match[1],
    },
  ];
}

function createTitleFromPandoc(node: ContainerDirective) {
  return {
    type: 'element',
    tagName: 'h3',
    children: createTitleValueFromPandoc(node) as ElementContent[],
    properties: {},
  };
}

function createTitleValueFromPandoc(node: ContainerDirective) {
  const name = node.name as string;
  const newRoot = {
    type: 'root',
    children: getTitleValueFromPandoc(node),
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
