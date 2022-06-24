import { spawn } from 'child_process';
import { EOL } from 'os';

import chalk from 'chalk';
import figureSet from 'figures';

const repo = 'UofGAnalytics/build-coursework';

export async function checkForLatestVersion() {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  const currentVersion = process.env.VERSION;

  try {
    const tags = await listRemoteGitTags();
    const latestTag = parseLatestTag(tags);

    if (latestTag !== currentVersion) {
      console.log(chalk.yellow.bold('New version available'));
      console.log(chalk.yellow(`Current version: ${currentVersion}`));
      console.log(chalk.yellow(`Latest version: ${latestTag}`));
      console.log(chalk.yellow(`Run the following command to update:`));
      console.log(chalk.yellow(`npm install -g ${repo}`));
      console.log('');
    } else {
      // console.log(chalk.yellow(`Up to date :)`));
    }
  } catch (err) {
    const message = `Can't read latest version from Github`;
    console.log(chalk.yellow.bold(`${figureSet.warning}  ${message}`));
    console.log(chalk.yellow(`Current version: ${currentVersion}`));
    console.log('');
  }
}

async function listRemoteGitTags() {
  return new Promise<string>((resolve, reject) => {
    // https://stackoverflow.com/questions/10649814#12704727
    const lsRemote = spawn('git', [
      '-c',
      'versionsort.suffix=-',
      'ls-remote',
      '--tags',
      '--sort=v:refname',
      `https://github.com/${repo}`,
    ]);

    const result: string[] = [];

    lsRemote.stdout.on('data', (data) => {
      const line = data.toString();
      // console.log('LINE', line);
      result.push(line);
    });

    lsRemote.stdout.on('end', () => {
      // console.log('STDOUT END');
      const end = result.join('').trim();
      // console.log('END', end);
      resolve(end);
    });

    lsRemote.stdout.on('error', (err) => {
      console.error('[get-latest-version]:', 'STDOUT error', err.message);
      reject();
    });

    lsRemote.stderr.on('data', (data) => {
      const str = data.toString();
      console.error('[get-latest-version]:', 'STDERR', str);
      reject();
    });
  });
}

function parseLatestTag(tags: string) {
  const lines = tags.split(EOL);
  const lastLine = lines[lines.length - 1];
  const match = lastLine.match(/tags\/v(\d+.\d+.\d+)/);
  if (match === null) {
    const message = `can't extract version from line: "${lastLine}"`;
    console.error('[get-latest-version]:', message);
    throw new Error(message);
  }
  return match[1];
}
