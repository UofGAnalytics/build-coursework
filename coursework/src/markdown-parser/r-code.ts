import { execSync } from 'child_process';
import { executeCode } from '../execute-code';

import { CodeParams } from './parse-code-params';
import { renderCodeBlock, renderCodeBlockWithOutput } from './util';

export function renderRCodeBlock(
  dirPath: string,
  code: string,
  options: CodeParams['options']
) {
  if (options.echo === true) {
    const out = executeCode(dirPath, code, executeRCode);
    return renderCodeBlockWithOutput('r', code, out);
  }

  return renderCodeBlock('r', code);
}

function executeRCode(code: string) {
  // I found this hack to allow R graphs to be written to stdout as SVG
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

  const out = execSync(`Rscript -e '${wrappedCode}'`).toString().trim();

  // If output is text it will print an empty SVG after, so remove it
  if (out.startsWith('[1]')) {
    return out.slice(0, out.indexOf('<?xml') - 1);
  }

  // If the output is SVG, remove the xml declaration at the top
  return out.slice(out.indexOf('<svg'));
}
