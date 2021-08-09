import { Context } from '../context';
import { convertMacroToDirective } from './convert-macro-to-directive';
import { reformatPandocSimpleTables } from './reformat-pandoc-simple-tables';
import { removeNewPage } from './remove-new-page';

// some of the original coursework syntax can't be parsed by
// existing plugins for unified.js, so in a "pre-parse" phase
// I transform some syntax using regex, so it can be parsed
export function preParsePhase(md: string, ctx: Context) {
  let result = md;

  // Remove commented sections
  result = result.replace(/<\!--.*?-->/g, '');

  // Convert macros to directives
  result = convertMacroToDirective(result);

  // Remove \\newpage lines
  result = removeNewPage(result);

  // Reformat Pandoc simple tables
  result = reformatPandocSimpleTables(result);

  return result;
}
