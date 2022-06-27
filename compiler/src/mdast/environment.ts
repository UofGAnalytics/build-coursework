import { ContainerDirective, LeafDirective } from 'mdast-util-directive';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';

export function environment() {
  return async (tree: Node) => {
    visit(tree, 'leafDirective', (node: LeafDirective) => {
      console.log('leaf', node);
    });

    visit(tree, 'containerDirective', (node: ContainerDirective) => {
      console.log('container', node);
    });
  };
}
