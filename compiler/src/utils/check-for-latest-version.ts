import path from 'path';

import fetch from 'node-fetch';

export async function checkForLatestVersion() {
  const response = await fetch(
    'https://api.github.com/repos/UofGAnalytics/build-coursework/releases/latest'
  );
  const json = await response.json();
  const latestTag = json.tag_name.replace('v', '');
  const packageJson = require(path.join(__dirname, 'package.json'));
  const currentTag = packageJson.version;

  if (latestTag !== currentTag) {
    console.log(
      `You are running version ${currentTag} and the latest version is ${latestTag}.`
    );
    console.log(`Run the following command to update:`);
    console.log(
      `npm install -g UofGAnalytics/build-coursework@v${latestTag}`
    );
  }
}
