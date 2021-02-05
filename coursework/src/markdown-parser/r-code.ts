// import path from 'path';
import { execSync } from 'child_process';
// import hashSum from 'hash-sum';
// import { getCacheDir } from '../util';

import { CodeParams } from './parse-code-params';
import { renderCodeBlock } from './util';

export function renderRCodeBlock(
  code: string,
  options: CodeParams['options']
) {
  let result = renderCodeBlock('r', code);

  if (options.echo === true) {
    const out = executeRCode(code);
    result += `<div class="out">${out}</div>\n`;
  }

  return result;
}

function readCache(code: string) {
  return null;
}

function writeCache(out: string) {
  return null;
}

function executeRCode(code: string) {
  // I found this hack to allow R graphs to be written to stdout as SVG
  // If output is text it will print an empty SVG after, so I remove it
  // If the output is SVG, I remove the xml declaration at the top
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

  return out.startsWith('[1]')
    ? out.slice(0, out.indexOf('<?xml') - 1)
    : out.slice(out.indexOf('<svg'));
}
