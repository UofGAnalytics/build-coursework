import path from 'path';

import { Options } from '../context';
import { createMessages } from './has-message';
import { rMarkdown } from '..';

export async function reportTestProcessor(
  fixture: string,
  options: Options = {}
) {
  const fixturePath = path.join('./fixtures', fixture);

  const [result] = await rMarkdown(fixturePath, {
    noDoc: true,
    noCache: true,
    noPdf: true,
    noWrite: true,
    noReport: true,
    noEmbedAssets: true,
    ...options,
  });

  return createMessages(result.files);
}
