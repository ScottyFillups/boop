const path = require('path')

module.exports = {
  entry: './client/index',
  output: {
    filename: 'bundle.js',
    path: path.resolve('./static/game')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'buble-loader'
      }
    ]
  },
  devtool: 'cheap-source-map'
}
