var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var config = require('../config');

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

var plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
];

config.build.pages.forEach(function(pageName) {
    plugins.push(new HtmlWebpackPlugin({
        filename: pageName + '.html',
        template: pageName + '.html',
        inject: true,
        chunks: [pageName]
    }))
})

module.exports = merge(baseWebpackConfig, {
    // eval-source-map is faster for development
    devtool: '#eval-source-map',
    plugins: plugins
});
