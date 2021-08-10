import { Context } from '../context';
import { convertNewPageToDirective } from './convert-block-tex';
import { convertTextBfToMd, convertUrlToMd } from './convert-inline-tex';
import { convertMacroToDirective } from './convert-macro-to-directive';
import { reformatPandocSimpleTables } from './reformat-pandoc-simple-tables';

// some of the original coursework syntax can't easily be parsed by
// existing plugins for unified.js, so in a "pre-parse" phase
// I transform some syntax using regex, so it can be parsed.
// A successful technique I found is to convert problem syntax to a
// custom markdown directive https://github.com/remarkjs/remark-directive
export function preParsePhase(md: string, ctx: Context) {
  let result = md;
  result = removeComments(result);
  result = convertMacroToDirective(result);
  result = convertTextBfToMd(result);
  result = convertUrlToMd(result);
  result = convertNewPageToDirective(result);
  result = reformatPandocSimpleTables(result);
  return result;
}

function removeComments(md: string) {
  return md.replace(/<\!--.*?-->/g, '');
}
