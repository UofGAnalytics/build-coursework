import { exec } from 'child_process';

it('should not find any tests set to "only" mode', async () => {
  const cmd = [
    'grep',
    '-rn',
    '--exclude-dir=node_modules',
    '--include="**/*.test.ts"',
    '-E "it.only|describe.only"',
    '.',
    '|| true',
  ];
  const output = await execute(cmd.join(' '));
  const results = formatOutput(output);
  if (results.length > 0) {
    logResults(results);
  }
  expect(results.length).toBe(0);
});

function execute(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, function (error, stdout, stderr) {
      if (error) return reject(error);
      if (stderr) return reject(stderr);
      return resolve(stdout);
    });
  });
}

type Line = {
  filePath: string;
  number: string;
  content: string;
};

type Grouped = {
  [key: string]: Line[];
};

function formatOutput(output: string) {
  const pattern = new RegExp(/^(.+):(\d+):\s*(\S+).only\('(.+)'/);
  return output
    .split('\n')
    .filter((line) => pattern.test(line))
    .map((line) => {
      const match = line.match(pattern) as RegExpMatchArray;
      return {
        filePath: match[1],
        number: match[2],
        content: `${match[3]}.only "${match[4]}"`,
      };
    });
}

function groupResults(results: Line[]) {
  return results.reduce((acc: Grouped, obj) => {
    if (!acc[obj.filePath]) {
      acc[obj.filePath] = [obj];
    } else {
      acc[obj.filePath].push(obj);
    }
    return acc;
  }, {});
}

function logResults(results: Line[]) {
  const grouped = groupResults(results);
  Object.entries(grouped).forEach(([filePath, fileResults]) => {
    const bright = '\x1b[36m';
    const dim = '\x1b[2m';
    const reset = '\x1b[0m';
    const maxNumLength = Math.max(
      ...fileResults.map((line) => line.number.length)
    );
    const fileTitle = `${bright}[no-only-test]: ${filePath}${reset}`;
    const formattedResults = fileResults.map((line) => {
      const padding = `${' '.repeat(maxNumLength - line.number.length)}`;
      return `${dim}${line.number}${reset}${padding} ${line.content}`;
    });
    console.log(`${fileTitle}\n${formattedResults.join('\n')}`);
  });
}
