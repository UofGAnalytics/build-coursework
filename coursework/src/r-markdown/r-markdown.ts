import { ChildProcess, spawn } from 'child_process';

// TODO: Got it: Rscript -e 'a <- c(1, 4, 2)' -save && Rscript -e 'a[3]' -restore

export async function executeRMarkdown(codes: string[]) {
  const rScript = spawn('R');

  for (const code of codes) {
    const response = await callResponse(rScript, code);
    console.log(response);
  }

  rScript.kill();
}

async function callResponse(child: ChildProcess, code: string) {
  // console.log(child);
  return new Promise((resolve, reject) => {
    child.stdout.once('data', (data) => {
      resolve({ code, response: data.toString() });
    });
    child.stderr.once('data', (data) => {
      reject(data.toString());
    });
    child.stdin.write(code + '\n');
  });
}
