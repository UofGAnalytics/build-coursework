import { exec } from 'child_process';

import { Context } from '../types';

export async function knitr(rMarkdown: string, ctx: Context) {
  // const rMarkdownStdIn = `tee <<"EOF"\n${rMarkdown}\nEOF\n`;
  const rMarkdownStdIn = `@"\n${rMarkdown}\n"@`;

  const inlineKnitr = `
    library(knitr)

    input <- file('stdin', 'r')
    content <- readLines(input)

    opts_chunk$set(
      dev='svglite'
    )

    knit(
      text=content,
      output='',
      quiet=TRUE
    )
  `;

  const command = `(${rMarkdownStdIn}) | Rscript -e "${inlineKnitr}"`;

  return new Promise<string>((resolve, reject) => {
    exec(command, { shell: 'powershell.exe' }, (err, response) => {
      if (err) {
        // console.log('ERROR', err);
        reject(err);
      } else {
        const res = formatResponse(response);
        // console.log(res);
        resolve(res);
      }
    });
  });
}

function formatResponse(response: string) {
  return response.replace(/\[1\]\s""$/m, '').trim();
}

// attempts at changing knitr output. doesn't work
// const hooks = `
//   knit_hooks$set(
//     source = function(x, options) {
//       paste(c("\`\`\`r", x, "\`\`\`"), collapse = "\n")
//     },
//     output = function(x, options) {
//       paste(c("\`\`\`", x, "\`\`\`"), collapse = "\n")
//     },
//     error = function(x, options) {
//       paste(
//         c(
//           "\`\`\`plaintext error",
//           gsub("## Error", "\#\# Error", x),
//           "\`\`\`"
//         ),
//         collapse = "\n"
//       )
//     }
//   )
// `;
