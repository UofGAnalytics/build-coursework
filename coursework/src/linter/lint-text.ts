import { VFile } from 'vfile';
import { Node } from 'unist';
import visit from 'unist-util-visit';

export function lintText() {
  return async (tree: Node, file: VFile) => {
    const transformations: Promise<void>[] = [];

    visit(tree, 'math', (node) => {
      transformations.push(text(node, file));
    });

    await Promise.all(transformations);

    return tree;
  };
}

async function text(node: Node, file: VFile) {}
