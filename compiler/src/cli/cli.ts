#!/usr/bin/env node

import yargs from 'yargs';

import { Options } from '../context';
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
    description: "Don't create HTML file",
  })
  .option('noPdf', {
    type: 'boolean',
    description: "Don't create PDF file",
  })
  .option('noSyntaxHighlight', {
    type: 'boolean',
    description: 'No syntax highlighting',
  })
  .option('noReport', {
    type: 'boolean',
    description: 'Bypass linter',
  })
  .option('noEmbedAssets', {
    type: 'boolean',
    description: "Don't embed assets",
  })
  .option('noCache', {
    type: 'boolean',
    description: 'No cache',
  })
  .option('noTexSvg', {
    type: 'boolean',
    description: 'No Tex Svg',
  })
  .option('spelling', {
    type: 'boolean',
    description: 'Check spelling',
  })
  .option('force', {
    type: 'boolean',
    description: 'Compile even with fatal errors',
  });

const dirPath = String(argv._[0] || '.');

const options: Options = {
  week: argv.week,
  watch: argv.watch,
  noDoc: argv.noDoc,
  noHtml: argv.noHtml,
  noPdf: argv.noPdf,
  noSyntaxHighlight: argv.noSyntaxHighlight,
  noReport: argv.noReport,
  noEmbedAssets: argv.noEmbedAssets,
  noCache: argv.noCache,
  noTexSvg: argv.noTexSvg,
  spelling: argv.spelling,
  force: argv.force,
};

rMarkdown(dirPath, options);
