import chalk from 'chalk';
import fetch from 'node-fetch';

const repo = 'UofGAnalytics/build-coursework';

export async function checkForLatestVersion() {
  const response = await fetch(
    `https://api.github.com/repos/${repo}/releases/latest`
  );
  const json = await response.json();
  const latestTag = json.tag_name.replace('v', '');
  const currentVersion = process.env.VERSION;

  if (latestTag !== currentVersion) {
    console.log(chalk.yellow.bold('New version available'));
    console.log(chalk.yellow(`Current version: ${currentVersion}`));
    console.log(chalk.yellow(`Latest version: ${latestTag}`));
    console.log(chalk.yellow(`Run the following command to update:`));
    console.log(chalk.yellow(`npm install -g ${repo}`));
    console.log('');
  }
}
