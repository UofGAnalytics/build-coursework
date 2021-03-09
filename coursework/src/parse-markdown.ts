import { VFile } from 'vfile';
import unified from 'unified';
import markdown from 'remark-parse';
import math from 'remark-math';
import directive from 'remark-directive';
import { youtubeVideos } from './transforms/youtube-videos';
import { embedAssetUrl } from './transforms/embed-assets';
import { lintLatex } from './transforms/lint-latex';
import { assertTaskAnswerStructure } from './transforms/task-answer';

// @ts-expect-error
import english from 'retext-english';
// @ts-expect-error
import spell from 'retext-spell';
// @ts-expect-error
import dictionary from 'dictionary-en-gb';
// @ts-expect-error
import lintAltText from '@double-great/remark-lint-alt-text';
// @ts-expect-error
import lintLinkText from '@mapbox/remark-lint-link-text';
// @ts-expect-error
import remark2retext from 'remark-retext';

const retextProcessor = unified().use(english).use(spell, dictionary);

const remarkProcessor = unified()
  .use(markdown)
  .use(directive)
  .use(math)
  .use(embedAssetUrl)
  .use(youtubeVideos)
  .use(lintLatex)
  .use(lintAltText)
  .use(lintLinkText)
  .use(assertTaskAnswerStructure)
  .use(remark2retext, retextProcessor);

export async function parseMarkdown(file: VFile) {
  const parsed = remarkProcessor.parse(file);
  return remarkProcessor.run(parsed, file);
}
