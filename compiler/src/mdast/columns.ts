import { BlockContent, Text } from 'mdast';
import { ContainerDirective } from 'mdast-util-directive';
import { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

export function columns() {
  return (tree: Node) => {
    visit(tree, 'containerDirective', (node: ContainerDirective) => {
      if (node.name === 'columns') {
        node.data = {
          hProperties: {
            className: 'columns',
          },
        };
      } else if (node.name === 'column') {
        node.data = {
          hProperties: {
            className: 'column',
          },
        };

        if (node.attributes?.imgsrc) {
          const altText = getAltText(node);

          const img = {
            type: 'image',
            url: node.attributes.imgsrc,
            alt: altText,
          } as unknown as BlockContent;

          if (altText) {
            Object.assign(node.children[0], img);
          } else {
            node.children.unshift(img);
          }
        }
      }
    });
  };
}

function getAltText(column: ContainerDirective) {
  const firstChild = column.children[0] as Parent;
  if (!firstChild) {
    return false;
  }

  const firstChildChildren = firstChild.children as Node[];
  if (!Array.isArray(firstChildChildren)) {
    return false;
  }

  const firstChildFirstChild = firstChildChildren[0] as Text;
  if (!firstChildFirstChild) {
    return false;
  }

  return firstChildFirstChild.value;
}
