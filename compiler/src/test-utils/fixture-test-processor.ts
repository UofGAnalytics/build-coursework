import path from 'path';

import { Parent as HastParent } from 'hast';
import { Parent as MDastParent } from 'mdast';
import { VFile } from 'vfile';

import { rMarkdown } from '..';

export async function fixtureTestProcessor(fixture: string) {
  const unit = {
    md: '',
    files: [] as VFile[],
    mdast: {} as MDastParent,
    hast: {} as HastParent,
    html: '',
  };

  const [result] = await rMarkdown(path.join('./fixtures', fixture), {
    noDoc: true,
    noCache: true,
    noPdf: true,
    noReport: true,
    noWrite: true,
    noEmbedAssets: true,
  });

  unit.md = result.md;
  unit.files = result.files;
  if (result.html) {
    unit.mdast = result.html.mdast;
    unit.hast = result.html.hast;
    unit.html = result.html.html;
  } else {
    console.log(
      '[test processor]: no html object returned from buildUnit'
    );
  }

  return unit;
}
