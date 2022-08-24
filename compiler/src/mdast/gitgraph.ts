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
          properties: { id: `gitgraph-${counter}` },
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
                // The global template js (template/src/index.ts) emits a custom event
                // 'template-ready' when initialised.  This is handy as the document
                // gets serveral <html> element classes added to it which causes re-renders.
                // Here, we wait for this custom event before rendering the gitgraphs,
                // and are careful to define all variables inside the the event callback
                `document.documentElement.addEventListener('template-ready', () => {`,
                '',
                `const graphContainer = document.getElementById("${id}");`,
                `const gitgraph = GitgraphJS.createGitgraph(graphContainer, ${options});`,
                `${node.value}`,
                '',
                `})`,
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
  return JSON.stringify({
    // orientation: 'vertical-reverse',
    template: {
      colors: ['#0075b0', '#00843d', '#7d2239', '#951272', '#7a6855'],
      branch: {
        color: '#ccc',
        lineWidth: 5,
        mergeStyle: 'bezier',
        spacing: 40,
        label: {
          display: true,
          bgColor: 'transparent',
          borderRadius: 10,
        },
      },
      arrow: {
        // size: 10,
        // color: '#ccc',
        // offset: -1.5
      },
      commit: {
        spacing: 40,
        hasTooltipInCompactMode: true,
        dot: {
          // size: 8,
          // strokeWidth: 0,
          size: 16,
          strokeWidth: 6,
          strokeColor: 'white',
        },
        message: {
          display: true,
          displayAuthor: false,
          displayHash: false,
          font: 'inherit',
          color: '#333',
        },
      },
      tag: {},
    },
  });
}
