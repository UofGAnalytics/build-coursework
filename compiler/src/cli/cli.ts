#!/usr/bin/env node

import chalk from 'chalk';
import figures from 'figures';
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
  .option('noEmbedAssetUrl', {
    type: 'boolean',
    description: "Don't complete asset Url",
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
  .option('pythonBin', {
    type: 'string',
    description: 'Custom path to python binary',
  })
  .option('force', {
    type: 'boolean',
    description: 'Compile even with fatal errors',
  })
  .option('verbose', {
    type: 'boolean',
    description: 'Show error stack',
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
  noEmbedAssetUrl: argv.noEmbedAssetUrl,
  noCache: argv.noCache,
  noTexSvg: argv.noTexSvg,
  spelling: argv.spelling,
  pythonBin: argv.pythonBin,
  force: argv.force,
  verbose: argv.verbose,
};

async function run() {
  try {
    await rMarkdown(dirPath, options);
  } catch (err: any) {
    console.log(chalk.red(figures.cross + ' ' + err.message));
    if (options.verbose) {
      console.error(err);
    }
    process.exit(1);
  }
}

run();
