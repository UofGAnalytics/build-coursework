import { Context } from '../context';
import { knitr } from '../knitr';
import { replaceMathWithAlias } from '../latex/replace-math-with-alias';
import { convertMacroToDirective } from './convert-macro-to-directive';
import { reformatPandocSimpleTables } from './reformat-pandoc-simple-tables';
import { removeNewPage } from './remove-new-page';

// some of the original coursework syntax can't be parsed by
// existing plugins for unified.js, so in a "pre-parse" phase
// I transform some syntax using regex, so it can be parsed
export async function markdownPhase(md: string, ctx: Context) {
  let result = md;

  // Remove commented sections
  result = result.replace(/<\!--.*?-->/g, '');

  // Converting macros to directives...
  result = convertMacroToDirective(result);

  // Removing \\newpage lines...
  result = removeNewPage(result);

  // Reformatting Pandoc simple tables...
  result = reformatPandocSimpleTables(result);

  // Extract all LaTeX and replace with alias
  // and build ctx.texStore
  result = replaceMathWithAlias(result, ctx);

  result = await knitr(result, ctx);

  return result;
}
