import { Node } from 'hast';
import visit from 'unist-util-visit';
import { startCase } from 'lodash';

export function incrementTitles() {
  const counter = createCounter();

  async function template(node: Node) {
    const children = node.children as Node[];
    let title = '';

    const name = node.name as string;
    const subject = startCase(name);
    const count = counter.increment(name);
    title += `${subject} ${count}`;

    const childChildren = children[0].children as Node[];

    // if the directive has a label, append in brackets
    // TODO: need to append mdast tree not string
    if (children[0]?.data?.directiveLabel) {
      const label = childChildren[0].value;
      title += ` (${label})`;
    }

    childChildren[0].value = title;
  }

  return async (tree: Node) => {
    visit(tree, 'containerDirective', (node) => {
      switch (node.name) {
        case 'example':
        case 'task':
        case 'answer':
          template(node);
      }
    });
    return tree;
  };
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
