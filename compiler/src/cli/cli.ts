#!/usr/bin/env node

import chalk from 'chalk';
import figures from 'figures';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { Options } from '../context';
import { reportHasFatalErrors } from '../linter/report';
import { rMarkdown } from '..';

const args = {
  week: {
    type: 'number',
    description: 'Build specific week (1-based index)',
  },
  watch: {
    type: 'boolean',
    description: 'Watch coursework for changes',
  },
  noDoc: {
    type: 'boolean',
    description: 'Only compile content HTML',
  },
  noHtml: {
    type: 'boolean',
    description: "Don't create HTML file",
  },
  noPdf: {
    type: 'boolean',
    description: "Don't create PDF file",
  },
  noSyntaxHighlight: {
    type: 'boolean',
    description: 'No syntax highlighting',
  },
  noReport: {
    type: 'boolean',
    description: 'Bypass linter',
  },
  noEmbedAssets: {
    type: 'boolean',
    description: "Don't embed assets",
  },
  noEmbedAssetUrl: {
    type: 'boolean',
    description: "Don't complete asset Url",
  },
  noCache: {
    type: 'boolean',
    description: 'No cache',
  },
  noTexSvg: {
    type: 'boolean',
    description: 'No Tex Svg',
  },
  noHexagons: {
    type: 'boolean',
    description: 'No cover hexagons',
  },
  spelling: {
    type: 'boolean',
    description: 'Check spelling',
  },
  pythonBin: {
    type: 'string',
    description: 'Custom path to python binary',
  },
  force: {
    type: 'boolean',
    description: 'Compile even with fatal errors',
  },
  verbose: {
    type: 'boolean',
    description: 'Show error stack',
  },
  envPlatform: {
    type: 'string',
    description: 'Specify which environment platform to display',
  },
  envProgram: {
    type: 'string',
    description: 'Specify which environment program to display',
  },
  envLanguage: {
    type: 'string',
    description: 'Specify which environment language to display',
  },
  fileName: {
    type: 'string',
    description: 'Specify name of output file',
  },
  output: {
    type: 'string',
    description: 'output to stdout',
    choices: ['md', 'html'],
  },
} as const;

const argv = yargs(hideBin(process.argv)).options(args).parseSync();

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
  noHexagons: argv.noHexagons,
  spelling: argv.spelling,
  pythonBin: argv.pythonBin,
  force: argv.force,
  verbose: argv.verbose,
  envPlatform: argv.envPlatform,
  envProgram: argv.envProgram,
  envLanguage: argv.envLanguage,
  fileName: argv.fileName,
  output: argv.output as 'md' | 'html',
};

async function run() {
  try {
    const weeks = await rMarkdown(dirPath, options);
    for (const week of weeks) {
      if (options.output === 'html') {
        console.log((week.html?.html || '').trim());
      }
      if (options.output === 'md') {
        console.log(week.md.trim());
      }
    }

    // correct exit code even when using --force
    for (const week of weeks) {
      if (reportHasFatalErrors(week.files)) {
        process.exit(1);
      }
    }
  } catch (err: any) {
    console.log(chalk.red(figures.cross + ' ' + err.message));
    if (options.verbose) {
      console.error(err);
    }
    process.exit(1);
  }
  process.exit(0);
}

run();
