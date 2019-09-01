const webpack = require('webpack');
const config = require('./webpack.config');

module.exports = function (cb) {
  const compiler = webpack(Object.assign({}, config));
  compiler.run((err, stats) => {
    cb();
  })
}