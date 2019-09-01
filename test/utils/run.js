const fs = require('fs');
const webpack = require('webpack');
const merge = require('webpack-merge');
const config = require('./webpack.config');
const sassSpritePlugin = require('../..');
const { resolve, join } = require('path');

const context = resolve(__dirname, '../mock-app');
const distPath = join(context, 'dist');

module.exports = function (filename, margin) {
  return new Promise(resolve => {
    const compiler = webpack(merge({
      context,
      entry: {
        index: join(context, 'entry.js')
      },
      output: {
        path: distPath
      },
      plugins: [
        new sassSpritePlugin(filename, margin)
      ]
    }, config));
    compiler.run((err, stats) => {
      resolve(stats.compilation.assets);
    });
  });
}