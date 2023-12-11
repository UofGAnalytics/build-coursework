import { VFile } from 'vfile';
import { Context, CodeBlock } from '../context';
import { EOL } from 'os';

// The reason for replacing all fenced code blocks with aliases
// temporarily is because of MathJax.  MathJax is designed to look
// for TeX code inside HTML files, and in our case we need to make it
// look inside a Markdown file. This leads to MathJax looking for TeX
// inside code blocks, which can causes problems (especially with SAS
// code syntax).  So this function replaces code blocks with an alias,
// allows MathJax to do it's thing, then adds it back in with
// `aliasDirectiveToCode`.

export async function codeToAliasDirective(file: VFile, ctx: Context) {
  const store: CodeBlock[] = [];
  file.value = codeBlocksToAlias(file.value as string, store);
  file.value = inlineCodeToAlias(file.value as string, store);
  ctx.codeStore = store;
  return file;
}

function codeBlocksToAlias(md: string, store: CodeBlock[]) {
  const verbatimStore: string[] = [];
  return md
    .replace(/^(~~~.+?^~~~)$/gms, (_, match) => {
      verbatimStore.push(match);
      return `::verbatimStore[${verbatimStore.length - 1}]`;
    })
    .replace(/^```(.+?)^```$/gms, (_, match) => {
      const lines = match.split(EOL);
      const lang = lines[0];
      const value = lines.slice(1).join(EOL);
      store.push({ lang, value });
      return `::codeBlock[${store.length - 1}]`;
    })
    .replace(/::verbatimStore\[(\d+)\]/g, (_, match) => {
      return verbatimStore[Number(match)];
    });
}

function inlineCodeToAlias(md: string, store: CodeBlock[]) {
  return md.replace(/`([^\n`]+?)`/g, (_, value) => {
    store.push({ value });
    return `:codeBlock[${store.length - 1}]`;
  });
}
