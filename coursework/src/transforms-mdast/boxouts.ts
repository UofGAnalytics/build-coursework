import { startCase } from 'lodash';
import toHast from 'mdast-util-to-hast';
import { Node, Parent } from 'unist';
import visit from 'unist-util-visit';

export function boxouts() {
  const counter = createCounter();

  function template(node: Node) {
    const name = node.name as string;
    const children = node.children as Node[];
    const count = counter.increment(name);
    const title = getTitle(node, count);
    const id = `${name}-${count}`;

    const className = ['boxout', name];
    const attributes = node.attributes as Record<string, string>;
    if (attributes.icon) {
      className.push(`${attributes.icon}-icon`);
    }

    const newChildren = children
      .filter((o) => !o.data?.directiveLabel)
      .map((o) => ({ ...toHast(o), name: o.name }));

    node.data = {
      hProperties: { className, id },
      hChildren: [title, ...newChildren],
    };
  }

  return async (tree: Node) => {
    visit(tree, 'containerDirective', (node) => {
      switch (node.name) {
        case 'example':
        case 'supplement':
        case 'background':
        case 'weblink':
        case 'task':
        case 'answer':
          template(node);
      }
    });
  };
}

function getTitle(node: Node, count: number): Node {
  return {
    type: 'element',
    tagName: 'h3',
    children: [
      {
        type: 'text',
        value: getTitleValue(node, count),
      },
    ],
  };
}

function getTitleValue(node: Node, count: number) {
  const subject = startCase(node.name as string);
  const children = (node.children || []) as Node[];
  const firstChild = (children[0] || {}) as Parent;
  const oldValue = getCurrentValue(firstChild);

  let newValue = `${subject} ${count}`;

  if (oldValue !== null) {
    newValue += ` (${oldValue})`;
  }

  return newValue;
}

function getCurrentValue(parent: Parent) {
  if (!parent.data?.directiveLabel) {
    return null;
  }
  const children = (parent.children || []) as Node[];
  const firstChild = (children[0] || {}) as Parent;
  return String(firstChild.value);
}

function createCounter() {
  const store: Record<string, number> = {};
  return {
    increment(key: string) {
      store[key] = (store[key] || 0) + 1;
      return store[key];
    },
  };
}
