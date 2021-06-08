// @ts-expect-error
import toVFile from 'to-vfile';
import { Parent } from 'unist';
import { VFile } from 'vfile';

import { rehypeParser } from '../utils/utils';

// export async function getAssetHast(name: string) {
//   const contents = await getAsset(name);
//   const vfile = toVFile({ contents }) as VFile;
//   const parsed = rehypeParser().parse(vfile) as Parent;
//   return parsed.children[0];
// }

export function getAssetHast(contents: string) {
  const vfile = toVFile({ contents }) as VFile;
  const parsed = rehypeParser().parse(vfile) as Parent;
  return parsed.children[0];
}
