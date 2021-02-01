#! /usr/bin/env node

const { buildCoursework } = require('../build')

const [, , ...args] = process.argv

console.log(process.cwd(), args)

buildCoursework('.')
