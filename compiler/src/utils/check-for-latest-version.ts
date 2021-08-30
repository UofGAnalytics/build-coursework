import fetch from 'node-fetch';

export async function checkForLatestVersion() {
  const response = await fetch(
    'https://api.github.com/repos/UofGAnalytics/build-coursework/releases/latest'
  );
  const json = await response.json();
  const latestTag = json.tag_name.replace('v', '');
  const currentVersion = process.env.VERSION;

  if (latestTag !== currentVersion) {
    console.log(
      `You are running version ${currentVersion} and the latest version is ${latestTag}.`
    );
    console.log(`Run the following command to update:`);
    console.log(
      'npm install -g https://github.com/UofGAnalytics/build-coursework'
    );
  }
}
