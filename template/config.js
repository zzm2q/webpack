// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var globEntries = require('./build/glob-entries');

module.exports = {
  build: {
    pages: globEntries(),
    assetsRoot: path.resolve(__dirname, 'dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false,
    md5Suffix: false
  },
  dev: {
    port: 8080,
    proxyTable: {}
  }
}
