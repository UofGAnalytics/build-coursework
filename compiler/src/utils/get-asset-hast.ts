import { Element, Parent } from 'hast';
import { toVFile } from 'to-vfile';

import { rehypeParser } from '../utils/utils';

// export async function getAssetHast(name: string) {
//   const contents = await getAsset(name);
//   const vfile = toVFile({ contents }) as VFile;
//   const parsed = rehypeParser().parse(vfile) as Parent;
//   return parsed.children[0];
// }

export function getAssetHast(value: string) {
  const vfile = toVFile({ value });
  const parsed = rehypeParser().parse(vfile) as Parent;
  return parsed.children[0] as Element;
}
