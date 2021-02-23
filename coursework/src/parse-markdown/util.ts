import unified from 'unified';
import rehype from 'rehype-parse';

export const rehypeParser = unified().use(rehype, { fragment: true });
