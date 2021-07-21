import { exec } from 'child_process';

import chokidar from 'chokidar';
import { debounce } from 'lodash';

const COURSE = 'apm';
const WEEK = 'week2';

chokidar
  .watch(['./compiler/src', './compiler/assets'])
  .on('all', debounce(rebuildAndRecompile, 300));

chokidar
  .watch(`./fixtures/${COURSE}/${WEEK}`, {
    ignoreInitial: true,
  })
  .on('all', debounce(recompile, 300));

async function rebuildAndRecompile() {
  await rebuildCompiler();
  await recompile();
}

async function rebuildCompiler() {
  console.log('rebuilding compiler...');
  const timerName = 'rebuilding compiler took';
  console.time(timerName);
  try {
    await runCommand('yarn workspace compiler build');
  } finally {
    console.timeEnd(timerName);
  }
}

async function recompile(eventName?: string, path?: string) {
  // console.log({ eventName, path });
  console.log('recompiling...');
  const timerName = 'compiling took';
  console.time(timerName);

  // TODO: watch single unit
  try {
    await runCommand(
      `yarn rmarkdown fixtures/${COURSE} --week=2 --noCache --noReport --noDoc`
    );
  } finally {
    console.timeEnd(timerName);
  }
}

// rmarkdown ../fixtures/rprog --week=1

function runCommand(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        if (stdout) {
          console.log(stdout);
        }
        console.error(error);
        reject(error);
      } else if (stderr) {
        if (stdout) {
          console.log(stdout);
        }
        console.error(error);
        reject(stderr);
      } else {
        if (stdout) {
          console.log(stdout);
        }
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
