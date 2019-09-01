const { resolve, join } = require('path');
const sassSpritePlugin = require('../..');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const context = resolve(__dirname, '../mock-app')

module.exports = {
  context,

  entry: {
    index: join(context, 'entry.js')
  },

  output: {
    path: join(context, 'dist'),
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin({ filename: 'style.css' }),
    new sassSpritePlugin()
  ]
}
