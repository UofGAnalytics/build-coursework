import { Code } from 'mdast';

import { parseCodeParams } from '../_parse-code-params';

it('should parse code params', async () => {
  expect(createNode('')).toStrictEqual({
    language: '',
    options: {},
  });

  expect(createNode('r')).toStrictEqual({
    language: 'r',
    options: {},
  });

  expect(createNode('{r}')).toStrictEqual({
    language: 'r',
    options: {},
  });

  expect(createNode(' r')).toStrictEqual({
    language: 'r',
    options: {},
  });

  expect(createNode(' {r}')).toStrictEqual({
    language: 'r',
    options: {},
  });

  expect(createNode(' r ')).toStrictEqual({
    language: 'r',
    options: {},
  });

  expect(createNode(' {r} ')).toStrictEqual({
    language: 'r',
    options: {},
  });

  expect(createNode('{r,echo=FALSE}')).toStrictEqual({
    language: 'r',
    options: {
      echo: false,
    },
  });

  expect(createNode('{r, echo=TRUE}')).toStrictEqual({
    language: 'r',
    options: {
      echo: true,
    },
  });

  expect(createNode('{r,a=1,b=2, c=3}')).toStrictEqual({
    language: 'r',
    options: {
      a: 1,
      b: 2,
      c: 3,
    },
  });

  expect(createNode('{r, 1=a,2=b,3=c}')).toStrictEqual({
    language: 'r',
    options: {
      '1': 'a',
      '2': 'b',
      '3': 'c',
    },
  });
});

function createNode(params: string) {
  const spaceIdx = params.indexOf(' ');
  let lang = params;
  let meta = '';
  if (spaceIdx !== -1) {
    lang = params.slice(0, spaceIdx);
    meta = params.slice(spaceIdx);
  }
  const node: Code = {
    type: 'code',
    lang,
    meta,
    value: 'test',
  };

  const { language, options } = parseCodeParams(node);

  return { language, options };
}
