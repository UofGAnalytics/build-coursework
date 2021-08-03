#!/usr/bin/env node

import yargs from 'yargs';

import { rMarkdown } from '..';

const { argv } = yargs(process.argv.slice(2))
  .option('week', {
    type: 'number',
    description: 'Build specific week (1-based index)',
  })
  .option('watch', {
    type: 'boolean',
    description: 'Watch coursework for changes',
  })
  .option('noDoc', {
    type: 'boolean',
    description: 'Only compile content HTML',
  })
  .option('noHtml', {
    type: 'boolean',
    description: 'Only compile content HTML',
  })
  .option('noPdf', {
    type: 'boolean',
    description: 'Only compile content HTML',
  })
  .option('noWrapper', {
    type: 'boolean',
    description: 'No wrapper',
  })
  .option('noSyntaxHighlight', {
    type: 'boolean',
    description: 'No syntax highlight',
  })
  .option('noReport', {
    type: 'boolean',
    description: 'Bypass linter',
  })
  .option('noEmbedAssets', {
    type: 'boolean',
    description: 'No embed assets',
  })
  .option('noCache', {
    type: 'boolean',
    description: 'No cache',
  })
  .option('spelling', {
    type: 'boolean',
    description: 'Check spelling',
  });

const dirPath = String(argv._[0] || '.');

const options = {
  week: argv.week,
  watch: argv.watch,
  noDoc: argv.noDoc,
  noHtml: argv.noHtml,
  noPdf: argv.noPdf,
  noWrapper: argv.noWrapper,
  noSyntaxHighlight: argv.noSyntaxHighlight,
  noReport: argv.noReport,
  noEmbedAssets: argv.noEmbedAssets,
  noCache: argv.noCache,
  spelling: argv.spelling,
};

rMarkdown(dirPath, options);
