import { Code } from 'mdast';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';

export function gitGraph() {
  return (tree: Node) => {
    let counter = 0;
    visit(tree, 'code', (node: Code) => {
      if (node.lang === 'gitgraph') {
        createGitGraph(node, ++counter);
      }
    });
  };
}

function createGitGraph(node: Code, counter: number) {
  const id = `gitgraph-${counter}`;
  const options = createDefaultOptions();
  Object.assign(node, {
    type: 'gitgraph',
    data: {
      hName: 'div',
      hProperties: {
        className: 'gitgraph',
      },
      hChildren: [
        {
          type: 'text',
          value: '\n',
        },
        {
          type: 'element',
          tagName: 'div',
          properties: { id },
        },
        {
          type: 'text',
          value: '\n',
        },
        // this will need to be "singleton" inlined
        {
          type: 'element',
          tagName: 'script',
          properties: {
            src: 'https://cdn.jsdelivr.net/npm/@gitgraph/js',
          },
          children: [],
        },
        {
          type: 'text',
          value: '\n',
        },
        {
          type: 'element',
          tagName: 'script',
          children: [
            {
              type: 'text',
              value: [
                '',
                `const graphContainer = document.getElementById("${id}");`,
                `const gitgraph = GitgraphJS.createGitgraph(graphContainer, ${options});`,
                '',
                node.value,
                '',
              ].join('\n'),
            },
          ],
        },
        {
          type: 'text',
          value: '\n',
        },
      ],
    },
  });
}

function createDefaultOptions() {
  const template = {
    colors: ['#be4d00', '#7a6855', '#00843d', '#7d2239', '#951272'],
    branch: {
      color: '#9ACCE6',
      lineWidth: 5,
      mergeStyle: 'bezier',
      spacing: 40,
      label: {
        display: true,
        bgColor: 'transparent',
        borderRadius: 10,
      },
    },
    commit: {
      spacing: 40,
      hasTooltipInCompactMode: true,
      dot: {
        size: 16,
        strokeWidth: 6,
        strokeColor: 'white',
      },
      message: {
        display: true,
        displayAuthor: false,
        displayHash: false,
        font: 'inherit',
      },
    },
    arrow: {},
    tag: {},
  };
  return JSON.stringify({ template });
}
