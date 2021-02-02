const path = require('path')
const yaml = require('js-yaml')
const loaderUtils = require('loader-utils')
const { buildCoursework } = require('coursework')

module.exports = async function courseworkLoader() {
  // const callback = this.async();

  console.log(this.context)

  this.addContextDependency(this.context);

  const html = await buildCoursework(this.context)
  console.log(html)

  this.emitFile('index.html', html)
  return false

  // buildCoursework(this.context).then((html) => {
  //   console.log(html)
  //   callback(null, html, map, meta);
  // })
}
