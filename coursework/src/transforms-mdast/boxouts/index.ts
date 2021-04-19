import { Node } from 'unist';
import visit from 'unist-util-visit';

import { createAnswer } from './answer';
import { createBackground } from './background';
import { createExample } from './example';
import { createSupplement } from './supplement';
import { createTask } from './task';
import { createCounter } from './utils';
import { createWeblink } from './weblink';

export function boxouts() {
  return async (tree: Node) => {
    const counter = createCounter();
    visit(tree, 'containerDirective', (node) => {
      switch (node.name) {
        case 'example':
        case 'supplement':
        case 'background':
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

function createBoxout(node: Node, count: number): Node[] {
  switch (node.name) {
    case 'example':
      return createExample(node, count);
    case 'supplement':
      return createSupplement(node, count);
    case 'background':
      return createBackground(node, count);
    case 'weblink':
      return createWeblink(node, count);
    case 'task':
      return createTask(node, count);
    case 'answer':
      return createAnswer(node, count);
    default:
      throw new Error(`Unsupported boxout name: ${node.name}`);
  }
}
