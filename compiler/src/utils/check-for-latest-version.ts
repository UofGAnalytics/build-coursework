import fetch from 'node-fetch';

export async function checkForLatestVersion() {
  const response = await fetch(
    'https://api.github.com/repos/UofGAnalytics/build-coursework/releases/latest'
  );
  const json = await response.json();
  console.log('release:', json.name);
}
