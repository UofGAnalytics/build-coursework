#! /usr/bin/env node
const path = require('path')
const { buildCourse } = require('../build')
const [, , dirPath = '.', ...args] = process.argv

const options = {
  noDoc: args.includes('--no-doc'),
  watch: args.includes('--watch'),
  watchDev: args.includes('--watch-dev')
}

buildCourse(dirPath, options)

// watch
const chokidar = require('chokidar');
const unitDir = path.join(dirPath, 'week1')
if (options.watch) {
  chokidar.watch(unitDir).on('change', () => {
    buildCourse(dirPath, options)
  });
}

// if (options.watchDev) {
//   chokidar.watch(unitDir).on('change', () => {
//     buildCourse(dirPath, options)
//   });
//   const srcDir = path.join(__dirname, 'build')
//   chokidar.watch(srcDir).on('change', () => {
//     buildCourse(dirPath, options)
//   });
// }
