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
  })
  .option('noDoc', {
    type: 'boolean',
    description: 'Only Compile content HTML',
  })
  .option('noReport', {
    type: 'boolean',
    description: 'Bypass linter',
  })
  .option('noDoc', {
    type: 'boolean',
    description: 'Only Compile content HTML',
  });

const dirPath = String(argv._[0] || '.');

const options = {
  week: argv.week,
  watch: argv.watch,
  noDoc: argv.noDoc,
  noReport: argv.noReport,
};

buildCourse(dirPath, options);
// console.log(dirPath, argv.week);
