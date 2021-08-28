export function convertTextBfToMd(contents: string) {
  const pattern = /\\textbf\{(.*?)\}/g;
  return contents.replace(pattern, (_, str) => `**${str}**`);
}

export function convertUrlToMd(contents: string) {
  const pattern = /\\url\{(.*?)\}/g;
  return contents.replace(pattern, (_, str) => str);
}
