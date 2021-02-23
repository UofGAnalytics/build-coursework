import { parseCodeParams } from './parse-code-params';

it('should parse code params', async () => {
  expect(parseCodeParams()).toStrictEqual({
    language: '',
    options: {},
  });

  expect(parseCodeParams('r')).toStrictEqual({
    language: 'r',
    options: {},
  });

  expect(parseCodeParams('{r}')).toStrictEqual({
    language: 'r',
    options: {},
  });

  expect(parseCodeParams(' r')).toStrictEqual({
    language: 'r',
    options: {},
  });

  expect(parseCodeParams(' {r}')).toStrictEqual({
    language: 'r',
    options: {},
  });

  expect(parseCodeParams(' r ')).toStrictEqual({
    language: 'r',
    options: {},
  });

  expect(parseCodeParams(' {r} ')).toStrictEqual({
    language: 'r',
    options: {},
  });

  expect(parseCodeParams('{r,echo=FALSE}')).toStrictEqual({
    language: 'r',
    options: {
      echo: false,
    },
  });

  expect(parseCodeParams('{r, echo=TRUE}')).toStrictEqual({
    language: 'r',
    options: {
      echo: true,
    },
  });

  expect(parseCodeParams('{r,a=1,b=2, c=3}')).toStrictEqual({
    language: 'r',
    options: {
      a: 1,
      b: 2,
      c: 3,
    },
  });

  expect(parseCodeParams('{r, 1=a,2=b,3=c}')).toStrictEqual({
    language: 'r',
    options: {
      '1': 'a',
      '2': 'b',
      '3': 'c',
    },
  });
});
