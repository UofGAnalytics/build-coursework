import { exec } from 'child_process';

import chokidar from 'chokidar';

const COURSE = 'rprog';

run();

async function run() {
  await rebuildCompiler();
  await recompile();
  console.log('open at http://localhost:3000');
  await runCommand('yarn workspace template dev');
}

chokidar.watch('./coursework/src').on('change', async () => {
  await rebuildCompiler();
  await recompile();
  console.log('done!');
});

chokidar
  .watch(`./fixtures/${COURSE}`, { ignored: '**/*.html' })
  .on('change', async () => {
    await recompile();
    console.log('done!');
  });

async function rebuildCompiler() {
  console.log('rebuilding compiler');
  console.time('rebuild-compiler');
  await runCommand('yarn workspace coursework build');
  console.timeEnd('rebuild-compiler');
}

async function recompile() {
  console.log('recompiling');
  console.time('compile');
  await runCommand(
    `yarn workspace coursework compile ../fixtures/${COURSE} --noReport --noDoc`
  );
  console.timeEnd('compile');
}

function runCommand(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        reject(error);
      } else if (stderr) {
        console.error(error);
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

// import liveServer from 'live-server';
// liveServer.start({
//   host: 'localhost',
//   port: 3000,
//   root: `fixtures/${FIXTURE}/build`,
//   open: false,
// });
