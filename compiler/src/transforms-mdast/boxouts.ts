import { startCase } from 'lodash';
import toHast from 'mdast-util-to-hast';
import { Node, Parent } from 'unist';
import visit from 'unist-util-visit';

export function boxouts() {
  return async (tree: Node) => {
    const counter = createCounter();
    visit(tree, 'containerDirective', (node) => {
      switch (node.name) {
        case 'example':
        case 'error':
        case 'supplement':
        case 'background':
        case 'definition':
        case 'weblink':
        case 'task':
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

function createAttributes(node: Node, count: number) {
  const name = node.name as string;
  const id = `${name}-${count}`;

  const attributes = node.attributes as Record<string, string>;
  const className = ['boxout', name];
  if (attributes.icon) {
    className.push(`${attributes.icon}-icon`);
  }
  return { className, id };
}

export function createBoxout(node: Node, count: number): Node[] {
  const typeTitle = createBoxoutType(node, count);
  const titles = [typeTitle];

  const titleValue = getTitleValue(node);
  if (titleValue !== null) {
    const title = createTitle(node);
    titles.push(title);
  }

  // console.log(
  //   toHast(
  //     {
  //       type: 'html',
  //       value:
  //         '<!-- This is a dataset on admissions to US medical schools which you have first seen in [Predictive Modelling](http://moodle2.gla.ac.uk/pluginfile.php/1457608/mod_resource/content/0/week9.pdf). -->',
  //     },
  //     { allowDangerousHtml: true }
  //   )
  // );

  const children = node.children as Node[];
  // if (count === 1 && node.name === 'example') {
  //   console.dir(children, { depth: null });
  // }

  const content = children
    .filter((o) => !o.data?.directiveLabel)
    .filter((o) => o.type !== 'containerDirective' && o.name !== 'answer')
    .map((o) => toHast(o), { allowDangerousHtml: true })
    .filter(Boolean);

  // if (count === 1 && node.name === 'example') {
  //   console.dir(content, { depth: null });
  // }

  if (node.name === 'task') {
    const answer = children.find((o) => o.type === 'containerDirective' && o.name === 'answer');
    if (answer) {
      content.push(createAnswer(answer, count));
    }
  }

  return [...titles, ...content];
}

function createAnswer(node: Node, count: number) {
  const hast = toHast(node);
  const children = hast.children as Node[];
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

function createBoxoutType(node: Node, count: number): Parent {
  const name = node.name as string;
  const label = startCase(name);
  const value = name === 'task' ? `${label} ${count}` : label;
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

function createTitle(node: Node): Parent {
  return {
    type: 'element',
    tagName: 'h3',
    children: [createTitleValue(node)],
  };
}

function createTitleValue(node: Node): Node {
  const name = node.name as string;
  const title = getTitleValue(node);
  if (name !== 'weblink') {
    return {
      type: 'text',
      value: title,
    };
  }
  const { target } = node.attributes as Record<string, string>;
  return {
    type: 'element',
    tagName: 'a',
    properties: {
      href: target,
      target: '_blank',
      className: ['target'],
    },
    children: [
      {
        type: 'text',
        value: title,
      },
    ],
  };
}

function getTitleValue(node: Node) {
  const children = (node.children || []) as Node[];
  const parent = (children[0] || {}) as Parent;
  if (!parent.data?.directiveLabel) {
    return null;
  }

  const parentChildren = (parent.children || []) as Node[];
  const firstChild = (parentChildren[0] || {}) as Parent;
  if (typeof firstChild.value !== 'string') {
    return null;
  }

  return String(firstChild.value);
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
