import { startCase } from 'lodash';
import { Node, Parent } from 'unist';
import visit from 'unist-util-visit';

export function incrementTitles() {
  const counter = createCounter();

  async function template(node: Node) {
    const name = node.name as string;
    const subject = startCase(name);
    const count = counter.increment(name);
    const data = node.data as { hChildren: Node[] };
    const parent = data.hChildren[0] as Parent;
    const child = parent.children[0];

    child.value = `${subject} ${count} (${child.value})`;
  }

  return (tree: Node) => {
    visit(tree, 'containerDirective', (node) => {
      switch (node.name) {
        case 'example':
        case 'task':
        case 'answer':
          template(node);
      }
    });
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
