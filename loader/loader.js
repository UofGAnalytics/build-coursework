const { getOptions } = require('loader-utils')
const { stringify } = require('javascript-stringify')
const yaml = require('js-yaml')

module.exports = function yamlLoader(src) {

  console.log(src)

  const doc = yaml.load(src)

  console.log(doc)

  return `export default ${JSON.stringify(doc)};`
}
