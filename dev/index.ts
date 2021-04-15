import { exec } from 'child_process';

import chokidar from 'chokidar';
import liveServer from 'live-server';

const FIXTURE = 'rprog';

liveServer.start({
  host: 'localhost',
  port: 3000,
  root: `fixtures/${FIXTURE}/build`,
  open: false,
});

const cmd = `yarn workspace coursework compile ../fixtures/${FIXTURE} --noReport`;

console.log('watching...');

chokidar.watch('./coursework/src').on('change', async () => {
  console.log('rebuilding coursework');
  await runCommand('yarn workspace coursework build');

  console.log('recompiling');
  await runCommand(cmd);

  console.log('done!');
});

chokidar.watch('./template/src').on('change', async () => {
  console.log('rebuilding template');
  await runCommand('yarn workspace template build');

  console.log('recompiling');
  await runCommand(cmd);

  console.log('done!');
});

chokidar
  .watch(`./fixtures/${FIXTURE}/`, { ignored: '**/*.html' })
  .on('change', async () => {
    console.log('recompiling');
    await runCommand(cmd);

    console.log('done!');
  });

function runCommand(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      if (stderr) {
        reject(stderr);
        return;
      }

      resolve(stdout);
    });
  });
}
