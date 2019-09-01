const { resolve, join } = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const context = resolve(__dirname, '../mock-app')

module.exports = {
  output: {
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
    new ExtractTextPlugin({ filename: 'style.css' })
  ]
}
