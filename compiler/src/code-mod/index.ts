import { containerDirective } from './container-directive';
import { formatBlockMath } from './format-block-math';
import { removeNewPage } from './remove-new-page';

export function codeMod(contents: string) {
  let newContents = contents;

  log('Converting macros to directives...');
  newContents = containerDirective(newContents);

  log('Removing \\newpage lines...');
  newContents = removeNewPage(newContents);

  log('Formatting block math...');
  newContents = formatBlockMath(newContents);

  return newContents;
}

function log(str: string) {
  console.log(str);
}
