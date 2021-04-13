import yargs from 'yargs';

import { buildCourse } from '../src';

const { argv } = yargs(process.argv.slice(2))
  .option('week', {
    alias: 'w',
    type: 'number',
    description: 'Build specific week (1-based index)',
  })
  .option('watch', {
    type: 'boolean',
    description: 'Watch coursework for changes',
  });

const dirPath = String(argv._[0] || '.');

buildCourse(dirPath);
// console.log(dirPath, argv.week);
