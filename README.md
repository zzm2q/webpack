# vue webpack 多页面模版

## Usage

```
vue init zzm2q/webpack
```

在`config.js`添加页面：

```
module.exports = {
  build: {
    pages: [
        'index',
        'page2',
        'page3',
        ...
    ],
    ...
  }
}
```

再在`src`下创建与页面名称相同的目录和入口文件即可：

```
src
  assets
  components
  index
    index.js
  page2
    page2.js
  page3
    page3.js
```

## 模版用途

使用自定义的模版生成项目，此模版也以下功能：

* 多页面多入口支持
* md5后缀可选性
* 针对业务路径进行调整

## 如何做到的

vue从官方的webpack模版生成的是单页单入口的：

* 页面：index.html
* 入口：src/main.js
* 组件：src/App.js

配置相关项有：

* config.js里的`build`里的`index`
* build/webpack.base.conf.js里的`entry`
* `webpack.dev.config.js`和`webpack.prod.config.js`里的`HtmlWebpackPlugin`

因此对以上配置进行修改：

**config.js里的`build`里的`index`** 修改如下：

```
build: {
  pages: [
    'index',
    ... //多页面配置在此
  ],
  ...
}
```

**build/webpack.base.conf.js里的`entry`**

通过config.js里配置的pages直接生成entry

```
var entry = {};
config.build.pages.forEach(function(pageName) {
    entry[pageName] = './src/' + pageName + '/' + pageName + '.js';
});

module.exports = {
  entry: entry,
  ...
}
```

由于以上这种自动生成方式，假定`config.js`里配置

```
pages: ['index', 'page2', 'page3']
```

相应的约定每个页面的入口在src下创建如下内容作为入口：

```
src
  index/index.js
  page2/page2.js
  page3/page3.js
```

**`webpack.dev.config.js`和`webpack.prod.config.js`里的`HtmlWebpackPlugin`**

相应的添加等量的HtmlWebpackPlugin配置，如下：


`webpack.dev.config.js`

```
var plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
];

config.build.pages.forEach(function(pageName) {
    plugins.push(new HtmlWebpackPlugin({
        filename: pageName + '.html',
        template: pageName + '.html',
        inject: true
    }))
})

module.exports = merge(baseWebpackConfig, {
    // eval-source-map is faster for development
    devtool: '#eval-source-map',
    plugins: plugins
});
```

`webpack.prod.config.js`

```
var plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    // extract css into its own file
    new ExtractTextPlugin(utils.assetsPath('css/[name].[contenthash].css'))
];

config.build.pages.forEach(function(pageName) {
    plugins.push(new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? pageName + '.html'
        : config.build.assetsRoot + '/' + pageName + '.html',
      template: pageName + '.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      }
    }));
});

module.exports = merge(baseWebpackConfig, {
  module: {
    loaders: utils.styleLoaders({ sourceMap: config.build.productionSourceMap, extract: true })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  vue: {
    loaders: utils.cssLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  plugins: plugins
})
```

另通过`npm run build`构建了出来的html引用`css`和`js`采用以`/`开头，不满足我们的需求，
通过修改`config.js`里的`assetsPublicPath`属性，改`./`

# The End
