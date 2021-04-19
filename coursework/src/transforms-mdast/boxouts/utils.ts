import { Node, Parent } from 'unist';

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

export function getTitleValue(node: Node) {
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
