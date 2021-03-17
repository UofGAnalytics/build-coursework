#! /usr/bin/env node

const { buildCourse } = require('../build')

const [, , dirPath, ...args] = process.argv

const noDoc = args.includes('--no-doc')

buildCourse(dirPath, { noDoc })
