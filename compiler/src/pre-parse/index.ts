import { VFile } from 'vfile';

import { allowNoWhitespaceBeforeHeading } from './allow-no-whitespace-before-heading';
import { convertNewPageToDirective } from './convert-block-tex';
import { convertTextBfToMd, convertUrlToMd } from './convert-inline-tex';
import { convertMacroToDirective } from './convert-macro-to-directive';
import { reformatPandocSimpleTables } from './reformat-pandoc-simple-tables';

// Some of the original coursework syntax can't easily be parsed by
// existing plugins for unified.js, so in a "pre-parse" phase
// I transform some syntax using regex so it can be parsed.
// A successful generic approach I found is to convert problem syntax to a
// custom markdown directive: https://github.com/remarkjs/remark-directive

export function preParsePhase(file: VFile) {
  let result = file.contents as string;
  result = removeCommentedSections(result);
  result = escapeDollarsInCodeBlocks(result);
  result = allowNoWhitespaceBeforeHeading(result);
  result = convertMacroToDirective(result);
  result = convertTextBfToMd(result);
  result = convertUrlToMd(result);
  result = convertNewPageToDirective(result);
  result = reformatPandocSimpleTables(result);
  file.contents = result;
  return file;
}

function removeCommentedSections(md: string) {
  return md.replace(/<\!--.*?-->/g, '');
}

function escapeDollarsInCodeBlocks(md: string) {
  return md.replace(/(```.+?```)/gms, (match) => {
    return '\n' + match.replace(/\$/g, '\\$') + '\n';
  });
}
