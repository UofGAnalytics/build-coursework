// import path from 'path';

// import fetch from 'node-fetch';

export async function checkForLatestVersion() {
  // const response = await fetch(
  //   'https://api.github.com/repos/UofGAnalytics/build-coursework/releases/latest'
  // );
  // const json = await response.json();
  // const latestTag = json.tag_name.replace('v', '');
  // const workspacePackagePath = path.join(__dirname, 'package.json');
  console.log('__dirname:', __dirname);
  console.log('process.cwd():', process.cwd());
  // const workspacePackageJson = require(workspacePackagePath);
  // const currentTag = workspacePackageJson.version;

  // if (latestTag !== currentTag) {
  //   console.log(
  //     `You are running version ${currentTag} and the latest version is ${latestTag}.`
  //   );
  //   console.log(`Run the following command to update:`);
  //   console.log(
  //     `npm install -g UofGAnalytics/build-coursework@v${latestTag}`
  //   );
  // }
}
