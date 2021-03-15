import { exec, ExecException } from 'child_process';

export async function executeRCode(code: string) {
  // I found this code to allow R graphs to be written to stdout as SVG
  // https://stackoverflow.com/questions/54309405#54310307
  const wrappedCode = `
    dev_stdout = function () {
      filename = tempfile()
      svg(filename)
      filename
    }

    dev_stdout_off = function (filename) {
      dev.off()
      on.exit(unlink(filename))
      fake_stdout = pipe("cat", "wb")
      on.exit(close(fake_stdout), add = TRUE)
      writeBin(readBin(filename, "raw", file.info(filename)$size), fake_stdout)
    }

    tmp_dev = dev_stdout()
    ${code}
    dev_stdout_off(tmp_dev)
  `;

  const execString = `Rscript -e '${wrappedCode}'`;

  return new Promise<string>((resolve, reject) => {
    exec(execString, (err, response) => {
      // console.log('ERROR', err);
      // console.log('RESPONSE', response);
      if (err) {
        reject(formatError(err, execString, code));
      } else {
        resolve(formatResponse(response));
      }
    });
  });
}

function formatError(
  err: ExecException,
  wrappedCode: string,
  code: string
) {
  err.message = err.message
    .replace(wrappedCode, `\n\n${code}\n`)
    .replace('Execution halted', '')
    .trim();
  return err;
}

function formatResponse(out: string) {
  // If output is text it will print an empty SVG after, so remove it
  if (out.startsWith('[1]')) {
    return out.slice(0, out.indexOf('<?xml') - 1);
  }

  // If the output is SVG, remove the xml declaration at the top
  return out.slice(out.indexOf('<svg'));
}
